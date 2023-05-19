const delay = (secs) => {
  return new Promise(resolve => setTimeout(() => resolve({ delay: secs }), secs * 1000));
};

export { delay };