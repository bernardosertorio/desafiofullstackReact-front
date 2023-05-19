import { AxiosError } from "axios";

const errorResponseFormatter = (error) => {
  let message = ''

  if (error instanceof TypeError) message = error.message
  if (error instanceof AxiosError) message = error?.response?.data?.message || error?.message

  return { message, ...error?.response?.data?.additionalInfo }
}

export { errorResponseFormatter }