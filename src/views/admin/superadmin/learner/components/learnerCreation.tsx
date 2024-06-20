import React, { useState, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';
// Chakra imports
import { Flex, SimpleGrid, Text, Box, Button, useColorModeValue, useToast, Table, Thead, Tbody, Tr, Th, Td, Radio, RadioGroup, Stack, Icon } from '@chakra-ui/react';


// Custom Imports
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectField';
import Card from 'components/card/Card';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyList, getSelectCreator,getSelectCohortsNames ,getCohortsByCreatorId} from 'utils/creator/creator';
import { getCountries } from 'utils/company/companyService';
import { addLearner, getLearnerById, learnerAdd, updateLearner } from 'utils/leaner/leaner';
import OnToast from 'components/alerts/toast';
import { FaLeaf } from 'react-icons/fa';
import { FaUpload, FaFileExcel } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineCloudUpload } from 'react-icons/md';
import Dropzone from 'views/admin/main/ecommerce/settingsProduct/components/Dropzone';
const CreatorCreation = () => {
  const isInvalid = true;
  const stroage = JSON.parse(localStorage.getItem('user'));
  let selectDisable = false;
  let storageCreatorId = '';
  if (stroage.data.role === 'Creator') {
    storageCreatorId = stroage.data.id;
    selectDisable = true;
  }
  console.log('storageCreatorId', storageCreatorId);
  const toast = useToast();
  const { id } = useParams();

  const navigate = useNavigate();
  // Chakra Color Mode    
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const [companyOptions, setCompanyOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [StoreOption, setStoreOption] = useState('Mannual');
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [indicate, setIndicate] = useState<boolean>(false);
  const [emptyInfo, setEmptyInfo] = useState([]);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [cohortsOptions, setCohortsOptions] = useState([]);

  const [specificInvalidIds, setspecificInvalidIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({ value: 'Active', label: 'Active' });
  type FormData = {
    [key: string]: {
      lenUserName: string[]; // Ensure lenUserName is an array of strings
      lenMail: string[];
      lenCountryId: string[];
      lenDepartment: string[];
      lenDesignation: string[];
      lenAge: string[];
      lenGender: string[];
      leanerId: number[];
    };
  };

  const additionalStyle = setIndicate ? { borderColor: 'red' /* add additional styles when setIndicate is true */ } : {};

  const [formData, setFormData] = useState({
    lenCompanyId: '',
    chId:'',
    lenCreatorId: storageCreatorId !== null && storageCreatorId !== undefined ? storageCreatorId : '',
    lenStatus: 'Active',
  });

  const [formDatas, setFormDatas] = useState<FormData>({
    '0': {

      lenUserName: [], // Ensure lenUserName is initialized as an array
      lenMail: [],
      lenCountryId: [],
      lenDepartment: [],
      lenDesignation: [],
      lenAge: [],
      lenGender: [],
      leanerId: [],
    },
    // ... other rows ...
  });

  const [noOfRows, setNoOfRows] = useState<any>(1);
  const [rows, setRows] = useState([{}]);


  interface OptionType {
    value: string;
    label: string;
  }
  interface OptionTypecon {
    value: string;
    label: string;
    CompanyId: string;
  }

  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '15px',
      borderColor: '#e0e5f2 !important',
      border: '1px solid',
      background: 'transparent',
      // height: '45px',
      width: '130px',
      padding: '0 !important',
    }),
  }

  const selectDatas = async (companyid: any) => {


    let data = {
      companyId: companyid,
    };
    const selectCreator = await getSelectCreator(JSON.stringify(data));
    if (selectCreator?.status !== 'Success') return console.log('getSelectCreator Error :', selectCreator?.message);
    setCreatorOptions(selectCreator?.data);

  }
  useEffect(() => {
    if (stroage.data.role !== 'Creator') {
      selectDatas(formData.lenCompanyId);
    }


  }, [formData.lenCompanyId]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (id) {
  //         const result = await getLearnerById(id);
  //         if (result?.status !== 'Success') return console.log('getLearnerById Error :', result?.message);
  //         setFormData(result?.data);
  //       }

  //       const result = await getCountries();
  //       if (result?.status !== 'Success') return console.log('getCountries Error :', result?.message);
  //       setCountryOptions(result?.data);
  //       const company = await getCompanyList();
  //       if (company?.status !== 'Success') return console.log('getCountries Error :', company?.message);

  //       setCompanyOptions(company?.data);

  //       const selectCreator = await getSelectCreator();
  //       if (selectCreator?.status !== 'Success') return console.log('getSelectCreator Error :', selectCreator?.message);



  //       setCreatorOptions(selectCreator?.data);

  //       const selectCohortsNames = await getSelectCohortsNames();
  //       if (selectCohortsNames?.status !== 'Success') return console.log('getSelectCohortsNames Error :', selectCohortsNames?.message);
  //       setCohortsOptions(selectCohortsNames?.data);
     
  //       console.log('cohortsOptionsdddddd', selectCohortsNames);

  //       const selectCreatorData: OptionTypecon[] = selectCreator?.data || [];
  //       const foundItem = selectCreatorData.find(item => item.value === storageCreatorId);

  //       setFormData({ ...formData, lenCreatorId: storageCreatorId });
  //       setFormData({ ...formData, lenCompanyId: foundItem.CompanyId });
  //       setFormData({ ...formData, chId: foundItem.CompanyId });
  //       //     const countriesResponse = await Axios.get(`${API_SERVER}/country/getAllCountries`);

  //       // if (countriesResponse.status === 200) {
  //       //     const countriesData = countriesResponse.data.data;
  //       //     console.log("Countries Response Data:", countriesData);
  //       //     setCountryOptions(countriesResponse.data.data);
  //       // } else {
  //       //     console.error('An error occurred while fetching the country data:', countriesResponse.data.data);
  //       // }

  //     } catch (error) {
  //       console.error('An error occurred while fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  // Sample options data

  const mappedCompanyOptions = Array.isArray(companyOptions)
    ? companyOptions.map((company) => ({
      value: company.cpId,
      label: company.cpCompanyName
    }))
    : [];

  const mappedCountryOptions = Array.isArray(countryOptions)
    ? countryOptions.map((country) => ({
      value: country.value,  // Change 'Id' to 'value'
      label: country.label,
    }))
    : [];




  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/learner/');
  };


  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
  ];
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];


  const date = new Date();
  const getYear = date.getFullYear();
  const getMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const getDate = date.getDate().toString().padStart(2, '0');
  const getHours = date.getHours().toString().padStart(2, '0');
  const getMinutes = date.getMinutes().toString().padStart(2, '0');

  const isoFormatDate = `${getYear}-${getMonth}-${getDate}`;


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, selectedOption?: any) => {
    const { name, value } = e.target;

    // If a selectedOption is provided, set the value of that field in the formData state
    if (selectedOption) {
      setFormData({ ...formData, [name]: selectedOption.value });
    } else {
      // Set the value of the field to the current value of the target
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleChangeflied = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [fieldName, rowIndex] = name.split('-');

    setFormDatas((prevData) => ({
      ...prevData,
      [rowIndex]: {
        ...prevData[rowIndex],
        [fieldName]: value,
      },
    }));
  };





  // const handleCompanyChange = (selectedOption: OptionType | null) => {
  //   setFormData({
  //     ...formData,
  //     lenCompanyId: selectedOption ? selectedOption.value : '',
  //     lenCreatorId: '',
  //   });
  // };
  
  // const handleCreatorChange = (selectedOption: OptionTypecon | null) => {
  //   if (selectedOption) {
  //     setFormData({
  //       ...formData,
  //       lenCreatorId: selectedOption.value,
  //       lenCompanyId: selectedOption.CompanyId,
  //     });
  //   } else {
  //     // Handle the case where selectedOption is null if needed
  //     setFormData({
  //       ...formData,
  //       lenCreatorId: '',
  //     });
  //   }
  // };
  
  // const handleCohortsChange = (selectedOption: OptionTypecon | null) => {
  //   setFormData({
  //     ...formData,
  //     chId: selectedOption ? selectedOption.value : '',
  //     // Do not overwrite lenCompanyId here
  //   });
  // };


  const handleCountryChange = (selectedOption: any, rowIndex: string) => {
    // Handle country change for the specific row
    setFormDatas((prevData) => ({
      ...prevData,
      [rowIndex]: {
        ...prevData[rowIndex],
        lenCountryId: selectedOption.value,
      },
    }));
  };



  const [allCohortsOptions, setAllCohortsOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const result = await getLearnerById(id);
          if (result?.status !== 'Success') {
            console.log('getLearnerById Error :', result?.message);
            return;
          }
          setFormData(result?.data);
        }

        const countriesResult = await getCountries();
        if (countriesResult?.status !== 'Success') {
          console.log('getCountries Error :', countriesResult?.message);
          return;
        }
        setCountryOptions(countriesResult?.data);

        const companyResult = await getCompanyList();
        if (companyResult?.status !== 'Success') {
          console.log('getCompanyList Error :', companyResult?.message);
          return;
        }
        setCompanyOptions(companyResult?.data);

        const creatorResult = await getSelectCreator();
        if (creatorResult?.status !== 'Success') {
          console.log('getSelectCreator Error :', creatorResult?.message);
          return;
        }
        setCreatorOptions(creatorResult?.data);

        const cohortsResult = await getSelectCohortsNames();
        if (cohortsResult?.status !== 'Success') {
          console.log('getSelectCohortsNames Error :', cohortsResult?.message);
          return;
        }
        setAllCohortsOptions(cohortsResult?.data); // Set all cohorts
        setCohortsOptions(cohortsResult?.data); // Initially show all cohorts

        console.log('cohortsOptions:', cohortsResult);

        const foundCreator = creatorResult?.data.find(
          (item:any) => item.value === storageCreatorId
        );

        setFormData({
          ...formData,
          lenCreatorId: storageCreatorId,
          lenCompanyId: foundCreator?.CompanyId || '',
        });

      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, [id]);



  const handleCompanyChange = (selectedOption: OptionType | null) => {
    setFormData({
      ...formData,
      lenCompanyId: selectedOption ? selectedOption.value : '',
      lenCreatorId: '',
    });
  };


// const handleCreatorChange = async (selectedOption: OptionTypecon | null) => {
//   if (selectedOption) {
//     setFormData({
//       ...formData,
//       lenCreatorId: selectedOption.value,
//       lenCompanyId: selectedOption.CompanyId,
//     });
//     console.log("selectedOption", selectedOption.value);

//     // Fetch and update cohorts based on the selected creator
//     const cohortsResult = await getCohortsByCreatorId(selectedOption.value);
//     if (cohortsResult?.status !== 'Success') {
//       console.log('getCohortsByCreatorId Error :', cohortsResult?.message);
//       return;
//     }
//     console.log("cohortsResult", cohortsResult);
//     if (cohortsResult?.getcreatorId) {
//       // Filter out unique chCohortsName values
//       // const uniqueCohorts = [...new Set(cohortsResult.map((cohort: any) => cohort.chCohortsName))];
//       const uniqueCohorts = [...new Set(cohortsResult.getcreatorId.map((cohort:any) => cohort.chCohortsName))];
//       console.log("uniqueCohorts", uniqueCohorts);
//       // Map the unique chCohortsName values to create an array of objects with value and label properties
//       const mappedCohorts = uniqueCohorts.map((cohortName: any) => ({
//         value: cohortName,
//         label: cohortName
//       }));
    
//       setCohortsOptions(mappedCohorts);
//     } else {
//       console.log('No data found for cohorts');
//       setCohortsOptions([]);
//     }
    
    
    
//   } else {
//     setFormData({
//       ...formData,
//       lenCreatorId: '',
//     });

//     // Fetch and update all cohorts when no creator is selected
//     const allCohortsResult = await getSelectCohortsNames();
//     if (allCohortsResult?.status !== 'Success') {
//       console.log('getSelectCohortsNames Error :', allCohortsResult?.message);
//       return;
//     }
//     console.log("allCohortsResult", allCohortsResult);
//     if (allCohortsResult?.data) {
//       setCohortsOptions(allCohortsResult.data.map((cohort: any) => ({
//         value: cohort.chCohortsName,
//         label: cohort.chCohortsName
//       })));
//     } else {
//       console.log('No data found for all cohorts');
//       setCohortsOptions([]);
//     }
//   }
// };


// const handleCreatorChange = async (selectedOption: OptionTypecon | null) => {
//   if (selectedOption) {
//     setFormData({
//       ...formData,
//       lenCreatorId: selectedOption.value,
//       lenCompanyId: selectedOption.CompanyId,
//     });

//     // Fetch and update cohorts based on the selected creator
//     const cohortsResult = await getCohortsByCreatorId(selectedOption.value);
//     if (cohortsResult?.status !== 'Success') {
//       console.log('getCohortsByCreatorId Error :', cohortsResult?.message);
//       return;
//     }

//     if (cohortsResult?.data) {
//       // Filter out unique cohort names
//       const uniqueCohorts = [...new Set(cohortsResult.data.map((cohort:any) => cohort.chCohortsName))];
//       console.log('uniqueCohorts',uniqueCohorts);
//       // Map the unique cohort names to create an array of objects with value and label properties
//       const mappedCohorts = uniqueCohorts.map(cohortName => ({
//         value: cohortName,
//         label: cohortName
//       }));
//       // Set cohortsOptions to the mappedCohorts
//       setCohortsOptions(mappedCohorts);
//     } else {
//       console.log('No data found for cohorts');
//       setCohortsOptions([]);
//     }
//   } else {
//     // When no creator is selected, show all cohorts
//     setFormData({
//       ...formData,
//       lenCreatorId: '',
//     });

//     // Fetch and update all cohorts
//     const allCohortsResult = await getSelectCohortsNames();
//     if (allCohortsResult?.status !== 'Success') {
//       console.log('getSelectCohortsNames Error :', allCohortsResult?.message);
//       return;
//     }

//     if (allCohortsResult?.data) {
//       // Map all cohorts to an array of objects with value and label properties
//       const mappedAllCohorts = allCohortsResult.data.map((cohort:any) => ({
//         value: cohort.chCohortsName,
//         label: cohort.chCohortsName
//       }));
//       // Set cohortsOptions to the mappedAllCohorts
//       setCohortsOptions(mappedAllCohorts);
//     } else {
//       console.log('No data found for all cohorts');
//       setCohortsOptions([]);
//     }
//   }
// };


const handleCreatorChange = async (selectedOption: OptionTypecon | null) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        lenCreatorId: selectedOption.value,
        lenCompanyId: selectedOption.CompanyId,
      });
  
      // Fetch and update cohorts based on the selected creator
      const cohortsResult = await getCohortsByCreatorId(selectedOption.value);
      if (cohortsResult?.status !== 'Success') {
        console.log('getCohortsByCreatorId Error :', cohortsResult?.message);
        return;
      }
  
      if (cohortsResult?.data) {
        // Filter out unique cohort names using the 'label' field
        const uniqueCohorts = [...new Set(cohortsResult.data.map((cohort: any) => cohort.label))];
        console.log('uniqueCohorts', uniqueCohorts);
        // // Map the unique cohort names to create an array of objects with value and label properties
        // const mappedCohorts = uniqueCohorts.map(cohortName => ({
        //   value: cohortName,
        //   label: cohortName,
        //   // chId: cohovalue,
  
        // }));
        const mappedCohorts = uniqueCohorts.map((cohortName:any) => {
          const cohort = cohortsResult.data.find(
            (cohort: any) => cohort.label === cohortName
          );
          return {
            value: cohort.value,
            label: cohort.label,
            chId: cohort.value, // Assuming chId is the same as value for each cohort
          };
        });
        // Set cohortsOptions to the mappedCohorts
        setCohortsOptions(mappedCohorts);
      } else {
        console.log('No data found for cohorts');
        setCohortsOptions([]);
      }
    } else {
      // When no creator is selected, show all cohorts
      setFormData({
        ...formData,
        lenCreatorId: '',
      });
  
      // Fetch and update all cohorts
      const allCohortsResult = await getSelectCohortsNames();
      if (allCohortsResult?.status !== 'Success') {
        console.log('getSelectCohortsNames Error :', allCohortsResult?.message);
        return;
      }
  
      if (allCohortsResult?.data) {
        // Map all cohorts to an array of objects with value and label properties using the 'label' field
        const mappedAllCohorts = allCohortsResult.data.map((cohort: any) => ({
          value: cohort.label,
          label: cohort.label,
          chId: cohort.value
        }));
        // Set cohortsOptions to the mappedAllCohorts
        setCohortsOptions(mappedAllCohorts);
      } else {
        console.log('No data found for all cohorts');
        setCohortsOptions([]);
      }
    }
  };
  











  const handleCohortsChange = (selectedOption: OptionType | null) => {
    setFormData({
      ...formData,
      chId: selectedOption ? selectedOption.value : '',
    });
  };







  const handleGenderChange = (selectedOption: any, rowIndex: string) => {
    // Handle country change for the specific row
    setFormDatas((prevData) => ({
      ...prevData,
      [rowIndex]: {
        ...prevData[rowIndex],
        lenGender: selectedOption.value,
      },
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.lenCompanyId) {

      setMsg('Please select the company name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenCreatorId) {

      setMsg('Please select the Creator Name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }



    let formDataStringified = JSON.stringify(formData);
    let formDatasStringified = JSON.stringify(formDatas);

    const formDatasParsed = JSON.parse(formDatasStringified);

    // const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emptyInfo = Object.entries(formDatasParsed).reduce(
      (acc: { position: string; name: string }[], [key, value]) => {
        const lenUserNameLength = (value as { lenUserName?: any }).lenUserName?.length;
        const lenMailValues = (value as { lenMail?: any }).lenMail || [];
        const lenMailLength = (value as { lenMail?: any }).lenMail?.length;
        const lenDepartmentLength = (value as { lenDepartment?: any }).lenDepartment?.length;
        const lenDesignationLength = (value as { lenDesignation?: any }).lenDesignation?.length;

        if (lenUserNameLength === 0 || lenMailLength === 0 || lenDepartmentLength === 0 || lenDesignationLength === 0) {

          if (lenUserNameLength === 0) {
            acc.push({ position: key, name: 'lenUserName' });

          }
          if (lenMailLength === 0) {
            acc.push({ position: key, name: 'lenMail' });
          }
          // if (lenMailValues.length !== 0) {
          //     for (const mailValue of lenMailValues) {
          //       if (!emailPattern.test(mailValue)) {
          //         acc.push({ position: key, name: 'lenMail' });
          //         break; // Break the loop if one email is not valid
          //       }
          //     } 
          //   }

          if (lenDepartmentLength === 0) {
            acc.push({ position: key, name: 'lenDepartment' });
          }
          if (lenDesignationLength === 0) {
            acc.push({ position: key, name: 'lenDesignation' });
          }
          // Add similar conditions for other properties if needed
        }

        return acc;
      },
      []
    );


    if (emptyInfo.length !== 0) {
      const mergerPosition = `${emptyInfo[0].name}-${emptyInfo[0].position}`;

      const inputFieldElement = document.getElementById(mergerPosition);
      if (inputFieldElement) {

        setspecificInvalidIds([mergerPosition]);
        inputFieldElement.focus();

      }

    } else {
      try {
        setButtonDisabled(true);
        let data = {
          defaultData: formData,
          learnerData: formDatas,
        };

        const result = await addLearner(JSON.stringify(data));
        if (result?.status === 'ValidationFailure') {
          setButtonDisabled(false);
          setspecificInvalidIds(result?.mails);
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
          return


        }
        else if (result?.status === 'existingLearnerEmails') {
          setButtonDisabled(false);
          setspecificInvalidIds(result?.mails);
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
          return
        }
        else if (result?.status === 'existingCreatorEmails') {
          setButtonDisabled(false);
          setspecificInvalidIds(result?.mails);
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
          return

        } else if (result?.status === 'Failure') {
          setButtonDisabled(false);
          console.log('updateLearner Error :', result?.message);
          setMsg('Failed to Create Learner');
          setToastStatus('error');
          setAlert(true);
          return
        }
        else if (result?.status === 'Success') {

          setMsg('Learner Stored');
          setToastStatus('success');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/learner');
          }, 200);
        }
      } catch (error) {
        setButtonDisabled(false);
        console.error('An error occurred while sending the request:', error);
      }



    }

    //   console.log(formDatasStringified);





    // try {
    //     if (id) {
    //         const result = await updateLearner(id, data);
    //         if (result?.status !== 'Success') {
    //             console.log('updateLearner Error :', result?.message);
    //             setMsg('Failed to Update Learner');
    //             setToastStatus('error');
    //             setAlert(true);
    //             return;
    //         }
    //         setMsg('Learner Updated');
    //         setToastStatus('success');
    //         setAlert(true);
    //         setTimeout(() => {
    //             navigate('/admin/superadmin/learner');
    //         }, 2000);


    //     } else {
    //         // This is a new plan, create it using POST request
    //         const result = await addLearner(data);
    //         if (result?.status === 'MailFailure') {
    //             setMsg(result?.message);
    //             setToastStatus('error');
    //             setAlert(true);
    //             return

    //         }
    //         if (result?.status !== 'Success') {
    //             console.log('updateLearner Error :', result?.message);
    //             setMsg('Failed to Create Learner');
    //             setToastStatus('error');
    //             setAlert(true);
    //             return
    //         }

    //         setMsg('Learner Stored');
    //         setToastStatus('success');
    //         setAlert(true);
    //         setTimeout(() => {
    //             navigate('/admin/superadmin/learner');
    //         }, 2000);

    //         const res = await learnerAdd(result?.data?.lenId)

    //         navigate('/admin/superadmin/learner');
    //         // const response = await Axios.post(`${API_SERVER}/creator/addcreator`, formData);

    //         // if (response.status === 201) {
    //         //     console.log('Data was successfully created.', response);
    //         // } else {
    //         //     console.error('Failed to create data.');
    //         // }
    //     }
    // } catch (error) {
    //     console.error('An error occurred while sending the request:', error);
    // }


  };

  console.log(specificInvalidIds, 'specificInvalidIds');
  const handleAddRow = () => {
    setNoOfRows(noOfRows + 1);
    const newRowId = noOfRows; // Use noOfRows directly as the new row ID
    setFormDatas((prevFormDatas) => ({
      ...prevFormDatas,
      [newRowId.toString()]: {
        lenUserName: [],
        lenMail: [],
        lenCountryId: [],
        lenDepartment: [],
        lenDesignation: [],
        lenAge: [],
        lenGender: [],
        leanerId: [],
      },
    }));
  };


  useEffect(() => {
    setRows(Array.from({ length: noOfRows }, (_, index) => ({ id: index + 1 })));
  }, [noOfRows]);


  // console.log('fsfsd', formData);
  //     /**************Excel Upload Area ********************* */
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(data);

    };

    reader.readAsBinaryString(file);
  };
  console.log('excelData', excelData)
  // console.log('fsfsd', formData);
  const dragNdrop1 = (event: any) => {
    var fileName = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("preview");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("src", fileName);
    preview.innerHTML = "";
    preview.appendChild(previewImg);
  }
  const drag1 = () => {
    const uploadFileParent = document.getElementById('uploadFile').parentNode as HTMLElement;
    if (uploadFileParent) {
      uploadFileParent.className = 'draging dragBox';
    }
  }

  const drop1 = () => {
    const uploadFileParent = document.getElementById('uploadFile').parentNode as HTMLElement;
    if (uploadFileParent) {
      uploadFileParent.className = 'dragBox';
    }


  }
  const drag = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const uploadFileParent = document.getElementById('uploadFile').parentNode as HTMLElement;
    if (uploadFileParent) {
      uploadFileParent.className = 'draging dragBox';
    }
  };

  const drop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      handleFileUpload(event);
    } else {
      console.log('Please drop a valid Excel file.');
    }
  };

  const dragNdrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("selectedfile", selectedFile)
    if (file && (file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      handleFileUpload(event);
    } else {
      console.log('Please select a valid Excel file.');
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
    setNoOfRows(1)
    // setExcelData([]); // Reset excelData to an empty array
    setFormDatas({});

  };
  const ArrayComparisonComponent = (excelhead: any) => {
    const array1 = ['S.No', 'LEARNER NAME', 'LEARNER MAIL', 'LEARNER DEPARTMENT', 'LEARNER DESIGNATION', 'LEARNER COUNTRY', 'LEARNER AGE', 'LEARNER GENDER'];
    const array2 = excelhead;
    if (excelhead) {
      console.log("arrays1", array1);
      console.log("arrays2", array2);
      const arraysAreEqual = (arr1: any, arr2: any) => {
        if (arr1.length !== arr2.length) {
          return false;
        }
        return arr1.every((element: any, index: any) => element === arr2[index]);
      };

      // return arraysAreEqual(array1, array2);
      if (!arraysAreEqual(array1, array2)) {
        setMsg('This file does not match');
        setToastStatus('error');
        setAlert(true);
        removeFile();
        return false;
      }

      return true;
    } else {

      setMsg('this file does nOt match');
      setToastStatus('error');
      setAlert(true);
      removeFile();
      return false;
      // return  false;

    }

  };



  useEffect(() => {


    if (excelData.length > 0) {
      if (ArrayComparisonComponent(excelData[0] ?? null)) {
        setNoOfRows(excelData.length - 1);

        console.log('excelData', excelData?.length);

        const updatedFormDatas: any = {};
        excelData?.slice(1)?.forEach((item, index) => {
          const counId = mappedCountryOptions.find((country) => country?.label?.toLowerCase() === item[5]?.toLowerCase())?.value
          console.log('counId', counId)
          updatedFormDatas[index.toString()] = {
            lenUserName: item[1],
            lenMail: item[2],
            lenDepartment: item[3],
            lenDesignation: item[4],
            lenCountryId: counId,
            lenAge: item[6],
            lenGender: item[7],
            leanerId: [],


          };
        });
        const excelwithoutsno = excelData[0].slice(1);
        console.log("excelwithoutsno", excelwithoutsno);
        setFormDatas((prevFormDatas) => ({
          ...prevFormDatas,
          ...updatedFormDatas,
        }));
      }
    }

  }, [excelData])

  const expectedColumnHeaders = [
    'learner Name',
    'learner Mail',
    'learner Department',
    'learner Designation',
    'learner Country',
    'learner Age',
    'learner Gender'
  ];
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brand = useColorModeValue('brand.500', 'brand.400');
  // /************************************** */

  
  

  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        marginTop={'75px'}
        position={'relative'}
      >
        <Card alignItems={'center'}>
          <Card
            bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
            w={'100%'}
            h={{ base: '170', sm: '170', md: '300', lg: '300' }}
            position={'relative'}
            alignItems={'center'}
          ></Card>
          <Card
            mb={{ base: '0px', xl: '20px' }}
            width={{ base: '95%', md: '70%' }}
            marginTop={'-120px'}
          >
            <Flex
              direction="row"
              w={'100%'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Box>
                <Text
                  color={useColorModeValue('secondaryGray.900', 'white')}
                  fontSize="2xl"
                  fontWeight="700"
                  mb="20px"
                >
                  Learner {id ? 'Updation' : 'Creation'}
                </Text>
              </Box>
              {/* <Box>
                                <Button bg={'#11047a'} color={'#fff'} mr={'10px'} >Click To Upload</Button>
                                <Button bg={'#11047a'} color={'#fff'}>Submit Data</Button>
                            </Box> */}
              {/* <Text fontSize='md' color={textColorSecondary}>
                                Here you can change your Creator details
                            </Text> */}


              <SimpleGrid columns={{ sm: 1, md: 2, lg: 1 }} spacing={{ base: '20px', xl: '20px' }}>
                <RadioGroup value={StoreOption} onChange={(e) => setStoreOption(e)} >
                  <Stack direction='row'>
                    <Radio value='Mannual'><strong>Add Learner Mannuly</strong> </Radio>
                    <Radio value='Excel'><strong>Add By Excel</strong></Radio>
                  </Stack>
                </RadioGroup>



              </SimpleGrid>
            </Flex>
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 3 }}
              spacing={{ base: '20px', xl: '20px' }}
            >
              <SelectField
                mb="0px"
                me="30px"
                id="lenCompanyId"
                name="lenCompanyId"
                label="Learner Company Name"
                options={companyOptions}
                onChange={handleCompanyChange}
                isRequired={true}
                value={
                  companyOptions.find(
                    (option) => option.value === formData.lenCompanyId,
                  ) || null
                }
                isDisabled={selectDisable}
                isClearable={true}
                styles={customStyles}
              />
              <SelectField
                mb="0px"
                me="30px"
                id="lenCreatorId"
                name="lenCreatorId"
                label="Creator Name"
                options={creatorOptions}
                onChange={handleCreatorChange}
                isRequired={true}
                value={
                  creatorOptions.find(
                    (option) => option.value === formData.lenCreatorId,
                  ) || null
                }
                isDisabled={selectDisable}
                isClearable={true}
                styles={customStyles}
              />

<SelectField
                mb="0px"
                me="30px"
                id="Cohorts"
                name="chCohortsNmae"
                label="Cohorts Name"
                options={cohortsOptions}
                onChange={handleCohortsChange}
                isRequired={true}
                value={
                  cohortsOptions.find((option) => option.value === formData.chId,) || null
                }
                isDisabled={selectDisable}
                isClearable={true}
                styles={{}} 
              />

              <InputField
                mb="0px"
                me="30px"
                id="creatorEntryDate"
                label="Learner Entry Date"
                type="date-local"
                defaultValue={isoFormatDate}
                disabled={true}
              />
            </SimpleGrid>

            {StoreOption === 'Excel' && (
              <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing={{ base: '20px', xl: '20px' }} style={{ marginTop: '20px' }}>
                {!selectedFile && (
                  <Dropzone
                    onChange={dragNdrop}
                    content={
                      <Box maxW='100%'>
                        <Icon as={MdOutlineCloudUpload} w='80px' h='80px' color={textColor} />
                        <Text
                          mb='12px'
                          fontSize='lg'
                          w='100%'
                          maxW='100%'
                          fontWeight='700'
                          color={textColor}
                          whiteSpace='pre-wrap'>
                          Drop your Excel here, or{' '}
                          
                          <Text as='span' fontSize='lg' fontWeight='700' color={brand}>
                            click to browse
                          </Text>
                        </Text>
                      </Box>
                    }
                  />
                )}
                {selectedFile && (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <FaFileExcel style={{ color: '#1D6F42', cursor: 'pointer', height: '100px', width: 'auto' }} />
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{fontSize: '0.875rem', fontWeight: 'bold', color: '#1B2559', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                        {selectedFile.name}
                      </span>
                      <button onClick={removeFile} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <FaTimes />
                      </button>
                    </span>
                  </div>
                )}
                {/* <div className="uploadOuter">
                    <Text>Upload Excel Here<span color='red'>*</span></Text>
                    <span className="dragBox" onDragOver={drag} onDrop={drop}>
                      {selectedFile && (
                        <div>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <FaFileExcel style={{ color: '#1D6F42', cursor: 'pointer', fontSize: '1.5em' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                              {selectedFile.name}
                            </span>
                            <button onClick={removeFile} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                              <FaTimes />
                            </button>
                          </span>
                        </div>
                      )}
                      {!selectedFile && (
                        <div>
                          Drag and Drop Excel file here
                          <input type="file" onChange={dragNdrop} id="uploadFile" />
                        </div>
                      )}
                    </span>
                  </div> */}

                <div style={{ display: 'flex',alignItems:'center'}}>
                  <a href={require('../sampleexcel/AtlantisSampleLearneData.xlsx')} download >
                    <FaFileExcel className="Dwonload-Excel" style={{ color: '#1D6F42', cursor: 'pointer', height: '100px', width: 'auto' }} /></a>
                  <Box>
                    <p className='Excelhead' style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1B2559' }} >Sample Excel file available for download by clicking here.</p>
                    <Text className='ExcelNote' style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1B2559' }}><span style={{ color: 'red' }}>Note: </span>Ensure that the country names are spelled correctly in Excel and that the gender names match those provided in the sample document. </Text>
                  </Box>
                </div>
              </SimpleGrid>
            )}

            {/* Table Input */}
            <Box m={'50px 0 20px 0'} w={'100%'} overflowX={'auto'}>
              <Table
                boxShadow={'1px 2px 17px #f7f7f7'}
                border={'2px solid #f1f1f1'}
                mb={'30px'}
              >
                <Thead whiteSpace={'nowrap'}>
                  <Tr>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Name<span style={{ color: 'red' }}>*</span>
                    </Th>

                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Mail<span style={{ color: 'red' }}>*</span>
                    </Th>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Department
                      <span style={{ color: 'red' }}>*</span>
                    </Th>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Designation
                      <span style={{ color: 'red' }}>*</span>
                    </Th>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Country
                    </Th>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Age
                    </Th>
                    <Th
                      color={'#000'}
                      fontFamily={'Nunito Sans'}
                      borderRight={'2px solid #f1f1f1'}
                    >
                      learner Gender
                    </Th>
                  </Tr>
                </Thead>
                <Tbody whiteSpace={'nowrap'}>
                  {rows.map((row, i) => (
                    <Tr key={i} whiteSpace={'nowrap'}>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <InputField
                          mb="0px"
                          me="30px"
                          id={`lenUserName-${i}`}
                          name={`lenUserName-${i}`}
                          placeholder="eg. jhon "
                          onChange={handleChangeflied}
                          value={formDatas[i]?.lenUserName || ''}
                          style={{
                            borderColor:
                              isInvalid &&
                                specificInvalidIds.includes(`lenUserName-${i}`)
                                ? 'red'
                                : '',
                          }}
                        />
                      </Td>

                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <InputField
                          mb="0px"
                          me="30px"
                          id={`lenMail-${i}`}
                          name={`lenMail-${i}`}
                          placeholder="eg. Mail@sample.com"
                          onChange={handleChangeflied}
                          value={formDatas[i]?.lenMail || ''}
                          autoComplete="off"
                          disabled={id ? true : false}
                          style={{
                            borderColor:
                              isInvalid &&
                                specificInvalidIds.includes(`lenMail-${i}`)
                                ? 'red'
                                : '',
                          }}
                        />
                      </Td>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <InputField
                          mb="0px"
                          me="30px"
                          id={`lenDepartment-${i}`}
                          name={`lenDepartment-${i}`}
                          placeholder="eg. sales "
                          onChange={handleChangeflied}
                          value={formDatas[i]?.lenDepartment || ''}
                          style={{
                            borderColor:
                              isInvalid &&
                                specificInvalidIds.includes(
                                  `lenDepartment-${i}`,
                                )
                                ? 'red'
                                : '',
                          }}
                        />
                      </Td>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <InputField
                          mb="0px"
                          me="30px"
                          id={`lenDesignation-${i}`}
                          name={`lenDesignation-${i}`}
                          placeholder="eg. new joinee"
                          onChange={handleChangeflied}
                          value={formDatas[i]?.lenDesignation || ''}
                          style={{
                            borderColor:
                              isInvalid &&
                                specificInvalidIds.includes(
                                  `lenDesignation-${i}`,
                                )
                                ? 'red'
                                : '',
                          }}
                        />
                      </Td>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <SelectField
                          mb="0px"
                          me="30px"
                          id={`lenCountryId-${i}`}
                          name={`lenCountryId-${i}`}
                          options={mappedCountryOptions}
                          // onChange={handleCountryChange}
                          onChange={(selectedOption: any) =>
                            handleCountryChange(selectedOption, i.toString())
                          }
                          value={
                            mappedCountryOptions.find(
                              (option) =>
                                option.value === formDatas[i]?.lenCountryId,
                            ) || null
                          }
                        />
                      </Td>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <InputField
                          mb="0px"
                          me="30px"
                          id={`lenAge-${i}`}
                          name={`lenAge-${i}`}
                          placeholder="eg. 30"
                          type="number"
                          onChange={handleChangeflied}
                          value={formDatas[i]?.lenAge || ''}
                        />
                      </Td>
                      <Td
                        p={'0.5rem 1.0rem'}
                        borderRight={'2px solid #f1f1f1'}
                      >
                        <SelectField
                          mb="0px"
                          me="30px"
                          id={`lenGender-${i}`}
                          name={`lenGender-${i}`}
                          options={genderOptions}
                          onChange={(selectedOption: any) =>
                            handleGenderChange(selectedOption, i.toString())
                          }
                          autoComplete="off"
                          value={
                            genderOptions.find(
                              (option) =>
                                option.value ===
                                (formDatas[i]?.lenGender || ''),
                            ) || null
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex mb={'20px'}>
                <Button
                  onClick={handleAddRow}
                  fontSize="sm"
                  color={'#190793'}
                  border={'1px solid #190793'}
                  bg={'transparent'}
                  _hover={{ bg: '#11047a', color: '#fff' }}
                >
                  Add Row
                </Button>
              </Flex>
            </Box>
            {/* <Flex flexDirection="row" justifyContent={'center'}>

                            <Button mt="20px" mr="10px" padding={2} background="#f7f4fe"  _hover={{background:"#e9edf7"}} color="#000" w={100} onClick={handleBack}>
                                Cancel
                            </Button>
                            <Button mt="20px"  padding={2} background="#3311db"  _hover={{background:"#3311db"}} color="#fff" w={100} onClick={handleSubmit} isDisabled={isButtonDisabled}>
                                {id ? 'Update' : 'Save'}
                            </Button>
                        </Flex> */}
            <Flex justify="space-between">
              <Button
                // variant="light"
                fontSize="sm"
                borderRadius="16px"
                border={'1px solid #00000024'}
                w={{ base: '128px', md: '148px' }}
                h="46px"
                mt="20px"
                mr="20px"
                bg={'transparent'}
                _hover={{ bg: '#11047a', color: '#fff' }}
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                mt="20px"
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                ms="auto"
                onClick={handleSubmit}
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </Flex>
          </Card>
        </Card>
      </Box>
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </>
  );
}

export default CreatorCreation;