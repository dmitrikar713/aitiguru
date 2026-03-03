import { useState } from "react";
import c from "./actions.module.scss";
import refreshIcon from "../../../../assets/refresh.svg";
import plusIcon from "../../../../assets/PlusCircle.svg";
import { Modal } from "@mantine/core";
import { AddProductForm } from "./modal";

export const Actions = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={c.actions}>
        <h2 className={c.title}>Все позиции</h2>
        <div className={c.buttons}>
          <button
            className={c.iconButton}
            onClick={() => {
              refetch();
            }}
          >
            <img src={refreshIcon} alt="Обновить" />
          </button>
          <button className={c.addButton} onClick={() => setOpen(true)}>
            <img src={plusIcon} alt="plus" />
            <p>Добавить</p>
          </button>
        </div>
      </div>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title={<h2>Добавить новый товар</h2>}
      >
        <AddProductForm />
      </Modal>
    </div>
  );
};
