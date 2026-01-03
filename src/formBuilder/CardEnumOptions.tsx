import React, {
  ReactElement,
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface CardEnumOptionsProps {
  initialValues: Array<any>;
  names?: Array<string>;
  showNames: boolean;
  onChange: (newEnums: Array<any>, newEnumNames?: Array<string>) => void;
  type: string;
}

// Input field corresponding to an array of values, add and remove
function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type,
}: CardEnumOptionsProps): ReactElement {
  // Use ref for stable ID generation (avoids issues with module-level counter)
  const nextIdRef = useRef(0);
  const generateId = useCallback(() => {
    nextIdRef.current += 1;
    return `enum-${nextIdRef.current}`;
  }, []);

  // Track stable IDs for each value to prevent focus loss on re-render
  const [itemIds, setItemIds] = useState<string[]>(() =>
    initialValues.map(() => {
      nextIdRef.current += 1;
      return `enum-${nextIdRef.current}`;
    }),
  );

  // Keep itemIds in sync with initialValues length
  // Only handle additions here - removals are handled explicitly in handleRemove
  const prevLengthRef = useRef(initialValues.length);
  useEffect(() => {
    const currentLength = initialValues.length;
    const prevLength = prevLengthRef.current;

    if (currentLength > prevLength) {
      // Items were added externally - add new IDs
      setItemIds((prevIds) => {
        const newIds = [...prevIds];
        for (let i = prevLength; i < currentLength; i++) {
          newIds.push(generateId());
        }
        return newIds;
      });
    }
    // Note: We don't handle removals here because handleRemove already
    // correctly removes the ID at the specific index. If removals happen
    // externally (not through handleRemove), the IDs will be out of sync,
    // but this is an edge case that would require tracking item identity.

    prevLengthRef.current = currentLength;
  }, [initialValues.length, generateId]);

  const handleRemove = (indexToRemove: number) => {
    // Update IDs first to remove the correct one
    setItemIds((ids) => [
      ...ids.slice(0, indexToRemove),
      ...ids.slice(indexToRemove + 1),
    ]);
    // Then update values
    onChange(
      [
        ...initialValues.slice(0, indexToRemove),
        ...initialValues.slice(indexToRemove + 1),
      ],
      names
        ? [...names.slice(0, indexToRemove), ...names.slice(indexToRemove + 1)]
        : undefined,
    );
  };

  const possibleValues = initialValues.map((value, index) => {
    let name = `${value}`;
    if (names && index < names.length) name = names[index];
    const itemId = itemIds[index] || `fallback-${index}`;

    return (
      <Box
        key={itemId}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          mb: 1,
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          value={value === undefined || value === null ? '' : value}
          placeholder='Possible Value'
          type={type === 'string' ? 'text' : 'number'}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            let newVal: string | number;
            switch (type) {
              case 'string':
                newVal = ev.target.value;
                break;
              case 'number':
              case 'integer':
                newVal = parseFloat(ev.target.value);
                if (Number.isInteger(newVal))
                  newVal = parseInt(ev.target.value, 10);
                if (Number.isNaN(newVal)) newVal = 0;
                break;
              default:
                throw new Error(`Enum called with unknown type ${type}`);
            }
            onChange(
              [
                ...initialValues.slice(0, index),
                newVal,
                ...initialValues.slice(index + 1),
              ],
              names,
            );
          }}
          size='small'
          sx={{ flex: 1 }}
        />
        {showNames && (
          <TextField
            value={name || ''}
            placeholder='Label'
            type='text'
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              if (names)
                onChange(initialValues, [
                  ...names.slice(0, index),
                  ev.target.value,
                  ...names.slice(index + 1),
                ]);
            }}
            size='small'
            sx={{ flex: 1 }}
          />
        )}
        <IconButton
          size='small'
          onClick={() => handleRemove(index)}
          aria-label='Remove possible value'
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>
    );
  });

  const handleAdd = useCallback(() => {
    // add a new dropdown option
    onChange(
      [...initialValues, type === 'string' ? '' : 0],
      names ? [...names, ''] : undefined,
    );
  }, [initialValues, names, onChange, type]);

  return (
    <>
      {possibleValues}
      <IconButton
        size='small'
        color='primary'
        aria-label='Add possible value'
        onClick={handleAdd}
      >
        <AddIcon fontSize='small' />
      </IconButton>
    </>
  );
}

export default memo(CardEnumOptions);
