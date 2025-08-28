

    if (result.modifiedCount === 1) {
      res.status(200).send({ message: '✅ Leave request added successfully.' });
    } else {
      res.status(404).send({ message: '❌ No document with leaveRequests array found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error', error: err.message });
  }
});
leaveApp.get('/leaveRequests', async (req, res) => {
    const mainCollection = req.app.get('mainCollection');
    try {
      const doc = await mainCollection.findOne({ leaveRequests: { $exists: true } });
      res.status(200).send({ leaveRequests: doc.leaveRequests });
    } catch (err) {
      res.status(500).send({ message: 'Error fetching leave requests' });
    }
  });
  leaveApp.put('/approve', async (req, res) => {
    const { email, checkOutDate, decision } = req.body; // decision: "accepted" or "rejected"
    const mainCollection = req.app.get('mainCollection');
  
    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).send({ message: 'Invalid decision type' });
    }
  
    try {
      const result = await mainCollection.updateOne(
        {
          leaveRequests: {
            $elemMatch: { email, checkOutDate },
          },
        },
        {
          $set: { "leaveRequests.$.approval": decision },
        }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).send({ message: `Leave request ${decision}` });
      } else {
        res.status(404).send({ message: 'Leave request not found' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Server error', error: err.message });
    }
  });
  
    
module.exports = leaveApp;
