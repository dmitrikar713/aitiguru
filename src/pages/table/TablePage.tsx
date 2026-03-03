import { Table } from "./table/table";
import { Header } from "./header/header";
import c from "./page.module.scss";

export const TablePage = () => {
  return (
    <div className={c.page}>
      <Header />
      <Table />
    </div>
  );
};
