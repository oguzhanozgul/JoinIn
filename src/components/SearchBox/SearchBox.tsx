import { useCallback, useState } from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import classes from "./SearchBox.module.css";

export interface SearchBoxProps extends TextInputProps {
  query?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBox = ({ query: queryProp, placeholder, onSearch, ...rest }: SearchBoxProps) => {
  const [query, setQuery] = useState<string>(queryProp || "");

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      onSearch?.(event.target.value);
    },
    [onSearch],
  );

  return (
    <TextInput
      w="400px"
      leftSection={<IconSearch />}
      placeholder={placeholder ?? "Search..."}
      size="search"
      value={query}
      onChange={onChange}
      classNames={{
        section: query ? classes.sectionFilled : classes.sectionEmpty,
      }}
      {...rest}
    />
  );
};
