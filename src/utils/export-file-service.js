import axios from 'axios';
import { API_URL } from '../services/apiUrl-Constant';
import { ROUTES } from '../routes/route';
import { store } from '../hooks/redux/store';
import { decryptAEStoString } from './toastEmitter';

// const downloadCSV = async (fileName,fileType,format) => {
const downloadCSVPDF = async (payload, format) => {
  const {
    fileName,
    fileType,
    privateSrcAddr,
    srcAddr,
    dstAddr,
    protocol,
    sourcePort,
    hostName
  } = payload;

  const filters = {
    fileName,
    fileType,
    privateSrcAddr,
    srcAddr,
    dstAddr,
    protocol,
    sourcePort,
    hostName
  }

  filters['format'] = format;
  

  try {
    let state = store.getState()
    const token = decryptAEStoString(state?.accessToken?.value)
    const response = await axios.get(`${API_URL.baseURL}${ROUTES.EXPORT_CSV}`,
      {
        params: filters, 
        responseType: 'blob', 
        headers: {          
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = new Blob([response.data], { type: `text/${format}` });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = payload.fileName.slice(0, -3) + format;;
    link.click();
    window.URL.revokeObjectURL(url); // cleanup
  } catch (error) {
    console.error(`Error downloading ${format}:`, error);
  }
};



export default downloadCSVPDF