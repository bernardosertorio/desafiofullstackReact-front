import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
  useBoolean
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi'
import FocusLock from "react-focus-lock"
import { MultiValue } from 'react-select';

import { useSendMessage } from '@/commons/contexts/send.message.context';

import SelectComponent from '@/components/form/inputs/select';

import { findAll as findEventTypes } from '@/commons/providers/mem/eventtypes.providers'

import STATUS from '@/commons/constants/status.constant'

interface SearchFilterProps {
  type: 'events'
}

const SearchFilter: React.FC<SearchFilterProps> = ({ type }) => {
  const { findEvents } = useSendMessage();

  const { onOpen, onClose, isOpen } = useDisclosure();
  const [filterIsActive, setFilterIsActive] = useBoolean();

  const eventsFieldRef = React.useRef(null)

  const [selectedEvents, setSelectedEvents] = useState<MultiValue<any>>([]);
  const [selectedStatus, setSelectedStatus] = useState<MultiValue<any>>([]);

  const [eventTypes, setEventTypes] = useState<any[]>([]);

  const statusOptions = Object.keys(STATUS).map((key, index) => ({ value: key, label: Object.values(STATUS)[index] }));

  useEffect(() => {
    handleEventTypes();
  }, [])

  const handleEventTypes = async () => {
    const events = await findEventTypes()

    setEventTypes(events.map(item => ({ value: item._id, label: `${item._id}` })).sort((a, b) =>  a.value - b.value))
  }

  const handleApplyFilter = () => {
    switch (type) {
      case 'events':
        let event_types, status;

        event_types = selectedEvents.map((item: any) => parseInt(item.value))
        status = selectedStatus.map((item: any) => item.value)

        findEvents({ event_types, status })

        if (event_types.length || status.length) setFilterIsActive.on()
        else setFilterIsActive.off();
        break;

      default:
        break;
    }

    onClose();
  };

  const Form = ({ onCancel }: any) => {
    return (
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Event Types</FormLabel>
          <SelectComponent
            isMulti
            name="event_types"
            options={eventTypes}
            placeholder="Selecione os event types"
            value={selectedEvents}
            onChange={setSelectedEvents}
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Status</FormLabel>
          <SelectComponent
            isMulti
            name="file_status"
            options={statusOptions}
            placeholder="Status do arquivo"
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </FormControl>
        <ButtonGroup display='flex' justifyContent='flex-end'>
          <Button variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button colorScheme='green' onClick={handleApplyFilter}>
            Aplicar
          </Button>
        </ButtonGroup>
      </Stack>
    )
  }

  return (
    <Flex>
      <Popover
        isOpen={isOpen}
        initialFocusRef={eventsFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton
            size='md'
            colorScheme={filterIsActive ? 'purple' : undefined}
            icon={<FiFilter />}
            aria-label={''}
          />
        </PopoverTrigger>
        <PopoverContent border={0} p={5}>
          <FocusLock aria-label={''} returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Form onCancel={onClose} />
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

export default SearchFilter;