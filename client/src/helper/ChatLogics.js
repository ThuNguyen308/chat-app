export const getSenderName = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1].name : users[0].name;
};

export const getSender = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1] : users[0];
};

export const isUserMessage = (loggedUser, message) => {
  return loggedUser._id === message.sender._id;
};

export const isSenderLastMessage = (message, messages, index) => {
  return (
    messages.length - 1 === index ||
    message.sender._id !== messages[index + 1].sender._id
  );
};
