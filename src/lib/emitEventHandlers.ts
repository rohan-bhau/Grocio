import axios from 'axios'
import React from 'react'

const emitEventHandlers = async (
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  socketId?: string,
) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export default emitEventHandlers
