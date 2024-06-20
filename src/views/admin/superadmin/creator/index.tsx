import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import CreatorDataTable from './components/CreatorDataTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { deletecreator, getAllCreator, getCreator, getCompanyList,CreatorStatus } from 'utils/creator/creator';
import { getPlanName } from 'utils/plan/plan';
import { getEndDateById, getValidityPeriod } from 'utils/planvalidity/planvalidity';
import { MdGroupAdd, MdDone, MdClose, MdVideogameAsset, MdAdd } from 'react-icons/md';
import { MdOutlineAutorenew } from "react-icons/md";
import AddCoharts from './components/AddRenewPlan';
import { Switch } from '@chakra-ui/react'
interface CreatorData {
  ctId: number;
  ctName: string;
  ctMail: string;
  // ctDesignation: string;
  ctPlanValidity: string;
  ctCountry: number;
  lenCohorts: string;
  // ctAge:number;
  ctStatus: any;
  ctPlanId: string;
  ctCompanyId: string;

  validityLogs?: ValidityLog[];
}
interface ValidityLog {
  phCreatorId: number;
  phPlanId: number;
  phValidityDays: string;
  phPlanValidityFrom: string;
  phPlanValidityTo: string;
  phRenewalPlanId: number | null;
  phRenewalValidityDays: string | null;
  phRenewalPlanValidityFrom: string | null;
  phRenewalPlanValidityTo: string | null;
}
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
  ctId: number;
  sNo: number;
  companyName: string;
  CreatorName: string;
  CreatorMail: string;
  planexpiry: string;
  renewplan: any;
  planduration: string;
  // creatorAge: number;
  // creatorGender:string;
  // creatorDesignation: string;
  status: any;
  plan: string;
  validity: string;
  action: any;
}
interface CreatorDataTableProps {
  data: RowObj[];
}
interface planType {
  plPlanName: string;
  plId: string;
  // other properties if any
}

const CreatorCreation: React.FC = () => {
  const [apiData, setApiData] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    ctStatus: '',
  });

  const fetchData = async () => {
    const result = await getAllCreator();
    if (result?.status !== 'Success') return console.log('getCreator Error :', result?.message);
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
  const getplanNameLabel = (ctPlanId: string): string => {
    console.log('ctPlanId:', ctPlanId);
    console.log('plan:', plan);

    const planOption = plan.find(
      option => option.plId === Number(ctPlanId)
    );
    console.log('planOption', planOption);

    return planOption ? planOption.plPlanName : '';
  };

  const handleStatus = async (ctId?: number, status?: string) => {
    setFormData(formData => ({
      ...formData,
      CtStatus: status
    }));
    let data = JSON.stringify(formData);
    if (ctId) {
      const result = await CreatorStatus(ctId, data);

      if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
      fetchData();
      // navigate('/admin/superadmin/creator');
    };
  }

  const handleDelete = async (ctId: number) => {
    setDeleteId(ctId);
    setIsOpen(true);
  };

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
  const transformData = (apiData: CreatorData[] | { count: number; rows: CreatorData[] }): RowObj[] => {
    // Extract the array from 'rows' if apiData is an object
    const dataArray = Array.isArray(apiData) ? apiData : apiData.rows;

    // Check if dataArray is an array
    if (!Array.isArray(dataArray)) {
      console.log("Data is not an array!");
      return [];
    }

    // Get the current date
    const currentDate = new Date().getTime();

    // Transform the data as before
    return dataArray.map((data, index) => {
      // Get the validity end date as a Date object
      const validityEndDate = data.validityLogs ? new Date(data.validityLogs[0]?.phPlanValidityTo).getTime() : null;

      // Calculate the difference in days
      const validityDaysRemaining = validityEndDate ? Math.ceil((validityEndDate - currentDate) / (1000 * 60 * 60 * 24)) : null;

      const validityEndDates = data.validityLogs ? new Date(data.validityLogs[0]?.phRenewalPlanValidityTo).getTime() : null;

      // Calculate the difference in days
      const validityDaysRemainingRenewal = validityEndDates
        ? Math.ceil((validityEndDates - currentDate) / (1000 * 60 * 60 * 24))
        : null;

      let Validitydays;
      let ValidityPlan;
      let ValidityDate;
      if (validityDaysRemaining > 0) {
        Validitydays = `${validityDaysRemaining} days left`;
        ValidityDate = data.validityLogs ? data.validityLogs[0]?.phPlanValidityTo : null;
        ValidityPlan = data.validityLogs ? data.validityLogs[0]?.phValidityDays.replace(/-/g, ' ') : null;
      }
      else if (validityDaysRemainingRenewal !== null && validityDaysRemainingRenewal > 0) {
        Validitydays = `${validityDaysRemainingRenewal} days left`;
        ValidityDate = data.validityLogs ? data.validityLogs[0]?.phRenewalPlanValidityTo : null;
        ValidityPlan = data.validityLogs ? data.validityLogs[0]?.phRenewalValidityDays.replace(/-/g, ' ') : null;
      } else {
        Validitydays = "Expired";
        // ValidityDate = "Expired";
        if (data.validityLogs && data.validityLogs[0]?.phRenewalPlanValidityTo === null) {
          // If phRenewalPlanValidityTo is null, show phPlanValidityTo
          ValidityDate = data.validityLogs[0]?.phPlanValidityTo;
        } else if (validityDaysRemaining < 0) {
          // If validityDaysRemaining is less than 0, show phRenewalPlanValidityTo
          ValidityDate = data.validityLogs ? data.validityLogs[0]?.phRenewalPlanValidityTo : null;
        }else {
          ValidityDate = "Expired";
        }
        ValidityPlan = "Expired";
        // data.validityLogs
        // ? (
        //     (data.validityLogs[0]?.phRenewalValidityDays ?? data.validityLogs[0]?.phValidityDays) || ''
        //   ).replace(/-/g, '')
        // : null;

      }

      return {
        ctId: data.ctId,
        sNo: index + 1,
        companyName: getCompanyNameLabel(data.ctCompanyId),
        CreatorName: data.ctName,
        CreatorMail: data.ctMail,
        plan: getplanNameLabel(data?.ctPlanId),
        planduration: ValidityPlan !== null ? ValidityPlan.toString() : null,
        planexpiry: ValidityDate !== null ? ValidityDate.toString() : null,
        renewplan: (
       
          <IconButton
            icon={<MdAdd />}
            onClick={() => handleCoharts(data.ctId)}
            // aria-label="Edit"
            variant="ghost"
            color="#d69e2e"
            aria-label='top'
						borderRadius='50%'
						// bg={'#E9EDF7'}
						// _hover='#E9EDF7'
						w='45px'
						h='45px'
						mb='5px'
            fontSize={24}
          />
         
         
        ),
        
      
        status: (
          <>
          {/* data?.lenStatus */}
           <Switch  colorScheme={'brandScheme'} onChange={() => handleStatus(data?.ctId, 'Active')} defaultChecked={data?.ctStatus === 'Active'} />
          
          </>
        ),
        validity: Validitydays !== null ? Validitydays.toString() : null,
        action: actionBtns(data),
      };
    });
  };



  const handleCoharts = (lenId?: number) => {
    setLearnerId(lenId || null);
    setOpenCoharts(true);
  }

  useEffect(() => {
    const deleteData = async () => {
      if (isConfirm) {
        if (deleteId) {
          const result = await deletecreator(deleteId);
          if (result?.status !== 'Success') {
            setIsOpen(false);
            setMsg('Creator Not Deleted');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          }
          setIsOpen(false);
          setMsg('Creator Deleted');
          setToastStatus('success');
          setAlert(true);
          setIsConfirm(false);
          fetchData();
        }
      }
    }
    deleteData()
  }, [isConfirm, deleteId]);
  useEffect(() => {
    fetchData();
  }, []);
  const transformedData: RowObj[] = transformData(apiData);

  // const transformedData: RowObj[] = transformData(apiData);
  useEffect(() => {
    const fetchData = async () => {
      try {

        const company = await getCompanyList();
        if (company?.status !== 'Success')
          return console.log('getCountries Error :', company?.message);
        console.log("company", company.data);
        setCompanyOptions(company?.data);
        const plans = await getPlanName(); // Replace with your actual function to get plan names
        if (plans?.status !== 'Success')
          return console.log('getPlanNames Error:', plans?.message);
        setplan(plans.data);

      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleSaveSelectedValues = (selectedIds: number[]) => {
    // Do something with the selectedIds
    console.log('Selected Values:', selectedIds);
  };
  return (
    <>
      <Box mb={{ base: '75px', md: '100px', xl: '100px' }}></Box>
      {/* <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}> */}
        <CreatorDataTable data={transformedData} setApiData={setApiData} />
      {/* </Card> */}
      {openCoharts ? <AddCoharts setOpenCoharts={setOpenCoharts} onSaveSelectedValues={handleSaveSelectedValues} learnerId={learnerId as number} />
        : null}
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null}
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert}
      /> : null}
    </>
  );
};

export default CreatorCreation;
