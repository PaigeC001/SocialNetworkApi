const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought by ID
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then((thought) =>
        thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        user ? res.json({ message: 'Thought created successfully!' }) : res.status(404).json({ message: 'User not found' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by ID
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((thought) =>
        thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by ID
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        // Remove the thought ID from the user's thoughts array
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought and associated reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thought) =>
        thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },
};
