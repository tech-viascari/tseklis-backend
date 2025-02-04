export const getAllQuotes = (req, res) => {
  return res.status(200).json({ quotes: [] });
};
