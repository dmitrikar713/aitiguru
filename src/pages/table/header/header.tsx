import { ProductSearch } from "./search";
import c from "./header.module.scss";

export const Header = () => {
  return (
    <div className={c.header}>
      <h2 className={c.headerTitle}>Товары</h2>
      <div className={c.searchBarWrapper}>
        <ProductSearch />
      </div>
    </div>
  );
};
