import type { ColDef } from "ag-grid-community";
import {
  ActionsRenderer,
  CheckboxRenderer,
  HeaderCheckboxRenderer,
  NameRenderer,
  PriceRenderer,
  RatingRenderer,
  SkuRenderer,
  VendorRenderer,
} from "./components/cells";
import styles from "./table.module.scss";
import type { Product } from "./types";

export const columnDefs: ColDef<Product>[] = [
  {
    headerName: "",
    width: 25,
    pinned: "left",
    suppressMovable: true,
    lockPosition: true,
    cellRenderer: CheckboxRenderer,
    headerComponent: HeaderCheckboxRenderer,
    cellStyle: {
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: "none",
    },
    headerClass: styles.checkboxHeader,
    suppressHeaderMenuButton: true,
    resizable: false,
  },
  {
    field: "title",
    headerName: "Наименование",
    sortable: true,
    filter: false,
    flex: 3,
    cellRenderer: NameRenderer,
    cellClass: styles.nameColumn,
  },
  {
    field: "brand",
    headerName: "Вендор",
    sortable: true,
    filter: false,
    flex: 1.5,
    cellRenderer: VendorRenderer,
  },
  {
    field: "sku",
    headerName: "Артикул",
    sortable: true,
    filter: false,
    flex: 1.5,
    cellRenderer: SkuRenderer,
  },
  {
    field: "rating",
    headerName: "Оценка",
    sortable: true,
    filter: false,
    flex: 1,
    cellRenderer: RatingRenderer,
  },
  {
    field: "price",
    headerName: "Цена, Р",
    sortable: true,
    filter: false,
    flex: 1.5,
    cellRenderer: PriceRenderer,
  },
  {
    headerName: "",
    flex: 1,
    cellRenderer: ActionsRenderer,
    suppressMovable: true,
    sortable: false,
    filter: false,
  },
];
