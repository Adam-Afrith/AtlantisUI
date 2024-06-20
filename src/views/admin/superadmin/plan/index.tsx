// Plan.tsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  Button,
  useColorModeValue,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import PlanDataTable from './components/PlanDataTable';
// import { MdEdit } from 'react-icons/md';
import { IconButton } from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { deleteplan, getplan, deleteplanName } from 'utils/plan/plan';
import { getSubscriptionPlan } from 'utils/subscriptionPlans/subscriptionPlan'


interface OptionType {
  value: string;
  label: string;
}

interface PlanData {
  psId: number;
  psPlanName: string;
  psPlanType: string;
  psPlanDuration: string;
  psStatus: string;
  psDeleteStatus: string;
  someAlias: {
    plId: number;
    plStatus: string;
    plDeleteStatus: string;
    plPlanName: string;
    // Add other properties if needed
  };
  // Add more fields as needed
}

interface RowObj {
  psId: number;
  sNo: number;
  planName: string;
  planType: string;
  validity: string;
  // planPrice: string;
  planStatus: string;
  plDeleteStatus: string;
  action: any;
}

// Declare handleNavigate before transformData
interface PlanDataTableProps {
  data: RowObj[];
} 
const Plan: React.FC = () => {

  const [apiData, setApiData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const result = await getplan();

      console.log('Subscription Plan Result:', result);

      if (result?.status !== 'Success') {
        console.error('Failed to fetch subscription plans:', result?.message);

      } else {
        console.log('plandata', result.data);
        setApiData(result.data);
      }

    } catch (error) {
      console.error('Error fetching subscription plans:', error);

    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Box mb={{ base: '75px', md: '100px', xl: '100px' }}></Box>
      <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}>
        <PlanDataTable data={apiData} onDataDeleted={fetchData} />
      </Card>
      {/* {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen}  msg={''} setmsg={''} /> : null} */}
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert} 
      /> : null}
    </>
  );
};

export default Plan;
