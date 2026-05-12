import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { usePlaylistStore } from "../../stores/playlistStore";

export function AddLinkForm() {
  const [url, setUrl] = useState("");
  const addItem = usePlaylistStore((state) => state.addItem);
  const lastError = usePlaylistStore((state) => state.lastError);
  const clearError = usePlaylistStore((state) => state.clearError);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const added = addItem(url);

    if (added) {
      setUrl("");
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          aria-label="YouTube 링크"
          hasError={Boolean(lastError)}
          onChange={(event) => {
            setUrl(event.target.value);
            if (lastError) clearError();
          }}
          placeholder="https://youtu.be/..."
          value={url}
        />
        <Button type="submit" variant="primary">
          <Plus size={18} />
          추가
        </Button>
      </div>
      {lastError ? <p className="text-sm text-red-300">{lastError}</p> : null}
    </form>
  );
}
