import React from 'react';
import { Tr, Td, Skeleton, Stack } from '@chakra-ui/react';

const SkeletonComponent = ({ type = 'div', rows, colSpan, height = 20 }) => {
  const renderSkeleton = () => {
    const items = Array.apply(null, Array(rows));

    switch (type) {
      case 'row':
        return (
          <>
            {items.map((_, index) => (
              <Tr key={`loading_${index}`}>
                <Td colSpan={colSpan}>
                  <Skeleton w={'full'} height={height} />
                </Td>
              </Tr>
            ))}
          </>
        )

      default:
        return (
          <Stack>
            {items.map((_, index) => (<Skeleton key={`loading_${index}`} height={height} />))}
          </Stack>)
    }
  }

  return renderSkeleton();
}

export default SkeletonComponent;