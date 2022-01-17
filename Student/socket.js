import io from "socket.io-client";
import {localhost as LOCAL_HOST} from "./localhost";

export const socket = io(`http://${LOCAL_HOST}:4000/`,{transports: ['websocket']});
