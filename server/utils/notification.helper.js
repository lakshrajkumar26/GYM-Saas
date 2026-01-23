exports.buildNotification = ({ title, message, userId, type }) => {
  return {
    title,
    message,
    userId,
    type,
    createdAt: new Date()
  };
};
