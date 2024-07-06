const createUniqueSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    Date.now()
  );
};

export default createUniqueSlug;
