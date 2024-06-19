const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  );
};

export default Loader;

export const Skeleton = ({ width = "unset" }: { width: string }) => {
  return (
    <div className="skeleton-loader" style={{ width }}>
      <div className="skeleton-shape">sa</div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  );
};
