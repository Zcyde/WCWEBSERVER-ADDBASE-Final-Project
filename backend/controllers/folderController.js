// controllers/folderController.js

const Folder = require('../models/Folder');
const Event = require('../models/Event');

exports.deleteFolder = async (req, res) => {
    try {
        const folderId = req.params.id;
        
        const eventResult = await Event.deleteMany({ folderId: folderId });
        console.log(`[Manual Cascade] Deleted ${eventResult.deletedCount} associated events.`);
        
        // 2. Delete the Folder itself.
        const folderResult = await Folder.findByIdAndDelete(folderId); 

        if (!folderResult) {
            return res.status(404).json({ message: 'Planner not found.' });
        }

        return res.status(204).send(); 

    } catch (err) {
        console.error(`FATAL SERVER ERROR during delete of folder ${req.params.id}:`, err);
        return res.status(500).json({ message: 'Server failed to delete the planner and its contents.' });
    }
};