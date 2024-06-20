import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import CreatorActivityDataTable from './components/CreatorActivityDataTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { getCreatorName ,CreatoractivityStatus} from 'utils/creatorActivity/CreatorActivity';
import { getPlanName } from 'utils/plan/plan';
import { getEndDateById, getValidityPeriod } from 'utils/planvalidity/planvalidity';
import { MdGroupAdd, MdDone, MdClose, MdVideogameAsset, MdAdd } from 'react-icons/md';
import { MdOutlineAutorenew } from "react-icons/md";

import { Switch } from '@chakra-ui/react'
interface CreatorActivityData {
  id: number;
  name: string;
  createdUserId: number | null;
  company: number;
  // status: string;
  nooflearners: number;
  noofgamespublished: number;
  noofgameslaunched: number;
  noofgames: number;
  timeSpent:any;
  // timeSpent: { lgTotalTime: string; lgUserId: number }[];
  LastActiveDate:string;
  // companyName: string;

  // validityLogs?: ValidityLog[];
}
// interface ValidityLog {
//   phCreatorId: number;
//   phPlanId: number;
//   phValidityDays: string;
//   phPlanValidityFrom: string;
//   phPlanValidityTo: string;
//   phRenewalPlanId: number | null;
//   phRenewalValidityDays: string | null;
//   phRenewalPlanValidityFrom: string | null;
//   phRenewalPlanValidityTo: string | null;
// }
interface OptionType {
  value: string;
  label: string;
}
 
// interface RowObj {
//   ctId: number;
//   sNo: number;
//   creatorName: string;
//   // creatorDesignation: string;
//   status:string;
//   creatorMail: string;
//   action: any;
// }
interface RowObj {
  id: number;
  sNo: number;
  // companyName: string;
  // CreatorName: string;
  CreatorName: string;
  createdUserId: number;
  company: number;
  nooflearners: number;
  noofgamespublished: number;
  noofgameslaunched: number;
  noofgames: number;
  timeSpent:any;
  // timeSpent: string | null;
  LastActiveDate:string;
  // action: JSX.Element; // Adjust the type according to your requirements
  // CreatorMail: string;
  // planexpiry: string;
  // renewplan: any;
  // planduration: string;
  // creatorAge: number;
  // creatorGender:string;
  // creatorDesignation: string;
  // status: JSX.Element;
  plan: string;
  validity: string;
  // action: any;
}
interface CreatorActivityDataTableProps {
  data: RowObj[];
}
interface planType {
  plPlanName: string;
  plId: string;
  // other properties if any
}

const CreatorActivityCreation: React.FC = () => {
  const [apiData, setApiData] = useState<CreatorActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [companyNames, setCompany] = useState([]);
  const [creatorNames, setCreator] = useState([]);

  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [plan, setplan] = useState([]);
  const [learnerId, setLearnerId] = useState<number | null>(null);
  const [openCoharts, setOpenCoharts] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
  });

  const fetchData = async () => {
    const result = await getCreatorName();
    console.log("test")
    console.log("lastDate",result.LastActiveDate)
    if (result?.status !== 'Success') return console.log('getCreatorName Error :', result?.message);
    setApiData(result?.data);
  }
  
  const mappedCompanyOptions = Array.isArray(companyOptions)
    ? companyOptions.map((company) => ({
      value: company.cpId,
      label: company.cpCompanyName,
    }))
    : [];
  const mappedPlanOptions = Array.isArray(plan)
    ? plan.map((plan) => ({
      value: plan.plId, // Convert to string if necessary
      label: plan.plPlanName,
    }))
    : [];
  const getCompanyNameLabel = (ctCompanyId: string): string => {
    console.log('ctCompanyId:', ctCompanyId);
    console.log('companyOptions:', companyOptions);

  
    const companyOption = companyOptions.find(
      option => option.value === Number(ctCompanyId)
    );
    console.log('companyOption', companyOption);

    return companyOption ? companyOption.label : '';
  };
  console.log('companyNames:', companyNames);
  const getplanNameLabel = (ctPlanId: string): string => {
    console.log('ctPlanId:', ctPlanId);
    console.log('plan:', plan);

    const planOption = plan.find(
      option => option.plId === Number(ctPlanId)
    );
    console.log('planOption', planOption);

    return planOption ? planOption.plPlanName : '';
  };

  // const handleStatus = async (id?: number, status?: string) => {
  //   setFormData(formData => ({
  //     ...formData,
  //     status: status
  //   }));
  //   let data = JSON.stringify(formData);
  //   if (id) {
  //     const result = await CreatoractivityStatus(id, data);

  //     if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
  //     fetchData();
  //     // navigate('/admin/superadmin/creator');
  //   };
  // }
 
  const handleDelete = async (ctId: number) => {
    setDeleteId(ctId);
    setIsOpen(true);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (ctId?: number) => {
    if (ctId) {
      navigate(`/admin/superadmin/creator/creation/${ctId}`);
    } else {
      navigate('creation');
    }
  };

  const actionBtns = (data: any) => {
    return (
      <Flex>
        <Tooltip placement='top' label="Edit">
          <div>
            <IconButton
              icon={<MdEdit />}
              onClick={() => handleNavigate(data.ctId)}
              aria-label="Edit"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
        <Tooltip placement='top' label="Delete">
          <div>
            <IconButton
              icon={<MdDelete />}
              onClick={() => handleDelete(data?.ctId)}
              aria-label="Delete"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
      </Flex>
    )
  }
 
  const transformData = (apiData: CreatorActivityData[] | { count: number; rows: CreatorActivityData[] }): RowObj[] => {
    // Extract the array from 'rows' if apiData is an object
    const dataArray = Array.isArray(apiData) ? apiData : apiData.rows;

    // Check if dataArray is an array
    if (!Array.isArray(dataArray)) {
      console.log("Data is not an array!");
      return [];
    }

    // Get the current date
    const currentDate = new Date().getTime();

    return dataArray.map((data, index) => ({
      
      id: data.id,
      sNo: index + 1,
      // companyName: data.companyName,
      CreatorName: data.name,
      createdUserId: data.createdUserId !== null ? data.createdUserId : 0,
      company:companyNames.find(item => item.value === data.company)?.label,
     nooflearners: data.nooflearners,
      noofgamespublished: data.noofgamespublished,
      noofgameslaunched: data.noofgameslaunched,
      noofgames: data.noofgames,
      timeSpent:data.timeSpent,
      LastActiveDate:data.LastActiveDate,
      // action: actionBtns(data), // You need to define actionBtns function
      // status: '', // You need to define how you get the status value
      plan: '', // You need to define how you get the plan value
      validity: '', // You need to define how you get the validity value
      // status: (
      //         <>
      //         {/* data?.lenStatus */}
      //          <Switch  colorScheme={'brandScheme'} onChange={() => handleStatus(data?.id, 'Active')} defaultChecked={data?.status === 'Active'} />
              
      //         </>
      //       ),
            
    }));

    
  };

  const transformedData: RowObj[] = transformData(apiData);

  return (
    <>
      <Box mb={{ base: '100px', md: '100px', xl: '100px' }}></Box>
      {/* <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}> */}
        <CreatorActivityDataTable data={transformedData} setApiData={setApiData} setCompany={setCompany}setCreator={setCreator}/>
      {/* </Card> */}
      
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null}
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert}
      /> : null}
    </>
  );
}

export default CreatorActivityCreation;
