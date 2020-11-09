import React from 'react'
import { FaTruckLoading } from 'react-icons/fa'
import styled from '@emotion/styled';

function Loading() {
  return (
    <StyledLoading >
      <FaTruckLoading />
      <h3>The truck is loading...</h3>
    </StyledLoading>
  )
}

const StyledLoading = styled.div`
  padding: 30px 10px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 15px;
`

export default Loading


