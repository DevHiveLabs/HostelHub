=> {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const captureAllImages = async () => {
    if (!name) {
      setStatus('Please enter your name before capturing.');
      return;
    }

    setCaptures([]);
    setDescriptors([]);
    setStatus('Capturing 10 images...');

    for (let i = 0; i < MAX_IMAGES; i++) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus(`Image ${i + 1}: Face not detected, retrying...`);
        i--;
        await delay(500);
        continue;
      }

      setCaptures((prev) => [...prev, canvas.toDataURL('image/jpeg')]);
      setDescriptors((prev) => [...prev, detection.descriptor]);
      setStatus(`Captured ${i + 1}/${MAX_IMAGES}`);
      await delay(400);
    }

    setStatus('✅ All images captured. Ready to register.');
  };

  const registerUser = () => {
    if (captures.length !== MAX_IMAGES || !name) {
      setStatus('Capture 10 images and provide a name.');
      return;
    }
    localStorage.setItem(
      `user_${name}`,
      JSON.stringify(descriptors.map((d) => Array.from(d)))
    );
    localStorage.setItem(`status_${name}`, 'checkout');
    setStatus(`Registered ${name}`);
    setCaptures([]);
    setDescriptors([]);
    setName('');
  };

  const checkInOut = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus('Face not detected. Try again.');
      return;
    }

    const storedUsers = Object.keys(localStorage).filter((k) => k.startsWith('user_'));
    const labeledDescriptors = storedUsers.map((key) => {
      const label = key.replace('user_', '');
      const descriptorsArray = JSON.parse(localStorage.getItem(key)).map(
        (arr) => new Float32Array(arr)
      );
      return new faceapi.LabeledFaceDescriptors(label, descriptorsArray);
    });

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.label === 'unknown') {
      setUserAction('');
      setStatus('Authentication Failed');
    } else {
      const key = `status_${bestMatch.label}`;
      const lastAction = localStorage.getItem(key);
      const newAction = lastAction === 'checkin' ? 'checkout' : 'checkin';
      localStorage.setItem(key, newAction);
      setUserAction(newAction);
      setStatus(`${bestMatch.label} successfully ${newAction}ed`);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-3xl mb-4 font-extrabold text-indigo-600">
        Facial {mode === 'register' ? 'Registration' : 'Check-In/Out'}
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            setMode('register');
            setStatus('');
            setUserAction('');
          }}
          className={`mr-2 px-5 py-2 rounded-full font-semibold transition-all shadow-md ${mode === 'register' ? 'bg-blue-600' : 'bg-gray-400'} text-white`}
        >
          Register
        </button>
        <button
          onClick={() => {
            setMode('check');
            setStatus('');
            setUserAction('');
          }}
          className={`px-5 py-2 rounded-full font-semibold transition-all shadow-md ${mode === 'check' ? 'bg-green-600' : 'bg-gray-400'} text-white`}
        >
          Check-In/Out
        </button>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        className="rounded-xl border shadow-lg mb-2"
      />
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: 'none' }}
      />

      {mode === 'register' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="checkinput p-2 border-2 rounded w-full mb-3"
          />
          <button
            onClick={captureAllImages}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 font-semibold rounded-xl shadow-lg transition"
          >
            📸 Auto-Capture 10 Faces
          </button>
          <button
            onClick={registerUser}
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold rounded-xl shadow-lg transition"
          >
            ✅ Register
          </button>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {captures.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Capture ${i}`}
                className="w-20 h-20 object-cover border-2 rounded shadow"
              />
            ))}
          </div>
        </div>
      )}

      {mode === 'check' && (
        <div className="mb-4">
          {userAction ? (
            <button
              onClick={checkInOut}
              className={`${
                userAction === 'checkin' ? 'bg-red-600' : 'bg-green-600'
              } text-white px-6 py-2 rounded-xl font-semibold shadow-md transition`}
            >
              {userAction === 'checkin' ? 'Check Out' : 'Check In'}
            </button>
          ) : (
            <button
              onClick={checkInOut}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
            >
              🔐 Authenticate
            </button>
          )}
        </div>
      )}

      <p className="mt-4 text-lg font-medium text-purple-700 animate-pulse">{status}</p>
    </div>
  );
}

export default CheckInOut;
