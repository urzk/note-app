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
    <li className="px-3" key={id}>
      <div className="px-3 py-1 rounded-md hover:bg-zinc-800 hover:shadow-lg">
        <div>
          <h2>{title}</h2>
        </div>
        <div>
          <small>2026/03/04</small>
        </div>
      </div>
    </li>
  );
};
