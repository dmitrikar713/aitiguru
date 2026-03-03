import type {
  ICellRendererParams,
  SelectionChangedEvent,
} from "ag-grid-community";
import { Checkbox } from "@mantine/core";
import type { Product } from "../types";
import { useEffect, useState } from "react";
import c from "./cells.module.scss";

const NameRenderer = (params: ICellRendererParams<Product>) => {
  if (!params.data) return null;
  return (
    <div className={c.nameCell}>
      <div className={c.productImage}></div>
      <div className={c.nameContent}>
        <div className={c.productName}>{params.data.title}</div>
        <div className={c.productCategory}>{params.data.category}</div>
      </div>
    </div>
  );
};

const RatingRenderer = (params: ICellRendererParams<Product>) => {
  if (!params.data) return null;
  const rating = params.data.rating || 0;
  const isLowRating = rating < 4;
  return (
    <span className={c.rating}>
      <b
        style={{
          color: isLowRating ? "#F11010" : "black",
          fontWeight: "normal",
        }}
      >
        {rating.toFixed(1)}
      </b>
      /5
    </span>
  );
};

const PriceRenderer = (params: ICellRendererParams<Product>) => {
  if (!params.data) return null;
  const price = params.data.price || 0;
  const [integerPart, decimalPart] = price.toString().split(".");

  const firstString = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const secondString = decimalPart ? decimalPart.slice(0, 2) : "00";
  return (
    <span className={c.price}>
      {firstString},
      <b
        style={{
          color: "#999999",
          fontWeight: "normal",
        }}
      >
        {secondString}
      </b>
    </span>
  );
};

const VendorRenderer = (params: ICellRendererParams<Product>) => {
  if (!params.data) return null;

  return <span className={c.vendor}>{params.data.brand}</span>;
};

const SkuRenderer = (params: ICellRendererParams<Product>) => {
  if (!params.data) return null;

  return <span className={c.sku}>{params.data.sku}</span>;
};

const CheckboxRenderer = (props: ICellRendererParams<Product>) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    const updateCheckboxState = () => {
      if (!props.node) return;

      const selected = props.node.isSelected();
      setIsChecked(selected as boolean);
    };

    const api = props.api;

    const handleSelectionChanged = () => {
      updateCheckboxState();
    };

    api.addEventListener("selectionChanged", handleSelectionChanged);

    api.addEventListener("modelUpdated", handleSelectionChanged);

    updateCheckboxState();

    return () => {
      api.removeEventListener("selectionChanged", handleSelectionChanged);
      api.removeEventListener("modelUpdated", handleSelectionChanged);
    };
  }, [props.api, props.node]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.node) return;

    props.node.setSelected(event.target.checked);
  };

  return (
    <div className={isChecked ? c.checkboxCellSelected : c.checkboxCell}>
      <Checkbox checked={isChecked} onChange={handleCheckboxChange} size="sm" />
    </div>
  );
};

const HeaderCheckboxRenderer = (params: SelectionChangedEvent) => {
  const api = params.api;
  const [selectionState, setSelectionState] = useState({
    allSelected: false,
    someSelected: false,
  });

  useEffect(() => {
    const updateSelectionState = () => {
      const selectedCount = api.getSelectedNodes().length;
      console.log("selectedCount");
      console.log(selectedCount);
      const totalCount = api.getDisplayedRowCount();

      setSelectionState({
        allSelected: selectedCount === totalCount && totalCount > 0,
        someSelected: selectedCount > 0 && selectedCount < totalCount,
      });
    };

    updateSelectionState();

    api.addEventListener("selectionChanged", updateSelectionState);
    api.addEventListener("modelUpdated", updateSelectionState);

    return () => {
      api.removeEventListener("selectionChanged", updateSelectionState);
      api.removeEventListener("modelUpdated", updateSelectionState);
    };
  }, [api]);

  const handleSelectAll = (checked: boolean) => {
    console.log(checked, "checked");
    if (checked) {
      api.selectAll();
    } else {
      api.deselectAll();
    }
  };

  return (
    <div className={c.topCheckboxWrapper}>
      <Checkbox
        checked={selectionState.allSelected}
        indeterminate={selectionState.someSelected}
        onChange={(e) => handleSelectAll(e.currentTarget.checked)}
        size="sm"
      />
    </div>
  );
};

const ActionsRenderer = () => {
  return (
    <div className={c.actionsCell}>
      <button className={c.actionButton} type="button">
        <span className={c.plusIcon}>+</span>
      </button>
      <button className={c.actionButton} type="button">
        <span className={c.moreIcon}>⋯</span>
      </button>
    </div>
  );
};

export {
  ActionsRenderer,
  CheckboxRenderer,
  HeaderCheckboxRenderer,
  PriceRenderer,
  RatingRenderer,
  NameRenderer,
  VendorRenderer,
  SkuRenderer,
};
