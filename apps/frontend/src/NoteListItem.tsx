export const NoteListItem = ({
  id,
  title,
  updatedAt,
}: {
  id: number;
  title: string;
  updatedAt: Date;
}) => {
  return (
    <li className="px-4 py-1" key={id}>
      <div>
        <h2>{title}</h2>
      </div>
      <div>
        <small>2026/03/04</small>
      </div>
    </li>
  );
};
