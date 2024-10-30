export type AsyncDataTableFooterOptionsType<TItem> = {
  onEdit: (item?: TItem) => void;
  onDelete: (item: TItem) => void;
};
