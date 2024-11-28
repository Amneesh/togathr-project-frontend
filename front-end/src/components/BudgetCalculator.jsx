import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import '../css/BudgetCalculator.css';
import '../css/AddBudgetItemModal.css'
import { addBudgetItemInDb, getOverviewData } from '../../api/mongoRoutingFile';
import DonutChart from './DonutChart';
import ProgressChartBar from './ProgressChartBar';
import BudgetCategory from '../utils/BudgetCategory.js';


import { Tabs, Tab } from '@mui/material';

const BudgetCalculator = ({ eventId }) => {
  const [items, setItems] = useState([]);
  const [event, setEvent] = useState();
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: '', itemName: '', estimateAmount: '', paidAmount: '', dueAmount: '', totalCost: '', budgetPercent: '', budgetCategory: '' });
  const [totalCostData, setTotalCostData] = useState([0]);
  const [estimateCostData, setEstimateCostData] = useState([0]);
  const [chartLabels, setChartLabels] = useState([]);
  const [totalDue, setTotalDue] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [maxBudget, setMaxBudget] = useState();
  const [dataPresent, setDataPresent] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0); // State for tab selection only for mobile screens
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640); // Detect mobile screen

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // setItems([])
        const response = await getOverviewData(eventId)
        let eventData = response['event_data'];
        setEvent(eventData);
        setItems(eventData.budgetItems);

        console.log('=============SELECTED EVENT DATA=============', eventData);
        setMaxBudget(eventData.maxBudget);
        if (eventData.budgetItems.length > 0) {
          setDataPresent(true);
          // setItems(allBudgetItems);
          let due = 0;
          let paid = 0;
          let total = 0;
          eventData.budgetItems.forEach(item => {
            due += parseFloat(item.dueAmount);
            paid += parseFloat(item.paidAmount ? item.paidAmount : 0);
            total += parseFloat(item.totalCost) && parseFloat(item.totalCost > 0 ? item.totalCost : item.estimateAmount);
          });

          setTotalDue(due);
          setAmountPaid(paid);
          setTotalCost(total);

          setBudgetCategories(eventData.budgetItems);
        } else {
          setDataPresent(false);
        }

        console.log('Event here is: ', eventId)
      } catch (error) {
        console.error('Error fetching budget items:', error);
      }
    };

    if (eventId) {
      fetchItems();
    }
  }, [eventId]);

  const setBudgetCategories = (items) => {
    let chartDetails = new Map();
    let estimateDetails = new Map();
    let listOfCategories = [];
    let totalCostOfEachCategory = [];
    let estimateCostOfEachCategory = [];

    items.map(item => {
      if (chartDetails.has(item.budgetCategory)) {
        if (parseFloat(item.totalCost) && parseFloat(item.totalCost) > 0) {
          chartDetails.set(item.budgetCategory, parseFloat(chartDetails.get(item.budgetCategory)) + parseFloat(item.totalCost));
        } else {
          chartDetails.set(item.budgetCategory, parseFloat(chartDetails.get(item.budgetCategory)) + parseFloat(item.estimateAmount));
        }
      } else {
        chartDetails.set(item.budgetCategory, (parseFloat(item.totalCost) ? parseFloat(item.totalCost) : parseFloat(item.estimateAmount)));
      }
    })

    items.map(item => {
      if (estimateDetails.has(item.budgetCategory)) {
        estimateDetails.set(item.budgetCategory, parseFloat(estimateDetails.get(item.budgetCategory)) + parseFloat(item.estimateAmount));
      } else {
        estimateDetails.set(item.budgetCategory, parseFloat(item.estimateAmount));
      }
    })

    chartDetails.forEach((cost, category) => {
      listOfCategories.push(category);
      totalCostOfEachCategory.push(cost);
    })

    estimateDetails.forEach((cost, category) => {
      estimateCostOfEachCategory.push(cost);
    })
    setChartLabels(listOfCategories);
    setTotalCostData(totalCostOfEachCategory);
    setEstimateCostData(estimateCostOfEachCategory);
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentItem({ id: '', itemName: '', estimateAmount: '', paidAmount: '', dueAmount: '', totalCost: '', budgetPercent: '', budgetCategory: '' }); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedItem = { ...currentItem, [name]: value };

    if (updatedItem.totalCost && updatedItem.totalCost > 0) {
      updatedItem.dueAmount = updatedItem.totalCost - updatedItem.paidAmount;
    } else {
      updatedItem.dueAmount = updatedItem.estimateAmount - updatedItem.paidAmount;
    }

    console.log(`INSIDE handle Change::::::::::: Updated Item Due Amount: ${updatedItem.dueAmount}`);
    setCurrentItem(updatedItem);
  };

  const validateForm = () => {
    const { itemName, budgetCategory, estimateAmount, paidAmount, totalCost } = currentItem;
    const effectivePaidAmount = parseFloat(paidAmount) || 0;
    const effectiveTotalCost = parseFloat(totalCost) || 0;
    console.log('current Item: ', currentItem)
    console.log(`Paid Amount:========= ${effectivePaidAmount} and Actual Cost:======= ${effectiveTotalCost}`)
    if (!itemName || !budgetCategory || !parseFloat(estimateAmount)) {
      alert('Please fill all mandatory fields!');
      return false;
    } else {
      if (effectivePaidAmount > 0 && effectiveTotalCost == 0) {
        alert('Please update the actual cost first!')
        return false;
      } else if (effectivePaidAmount > effectiveTotalCost) {
        console.log(`Paid Amount: ${effectivePaidAmount} and Actual Cost: ${effectiveTotalCost}`)
        alert('Paid amount cannot be greater than actual cost!');
        return false;
      } else {
        return true;
      }
    }
  };

  // Handle submit event
  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (currentItem.id) {
        event.budgetItems = event.budgetItems.map(item => (item.id === currentItem.id ? currentItem : item));
      } else {
        currentItem.id = Date.now();
        event.budgetItems.push(currentItem);
      }


      let sumOfBudgetEstimate = 0;
      event.budgetItems.map(item => {
        sumOfBudgetEstimate += parseFloat(item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount);
      });

      event.budgetItems.map(item => {
        item.budgetPercent = (((item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount) / sumOfBudgetEstimate) * 100).toFixed(2);
      })
      const response = await addBudgetItemInDb('events', event);

      setItems(response.budgetItems);

      // Show the table with items
      setDataPresent(true);

      // To refresh chart data
      setBudgetCategories(response.budgetItems);

      let due = 0;
      let paid = 0;
      let total = 0;
      response.budgetItems.forEach(item => {
        due += parseFloat(parseFloat(item.dueAmount) ? parseFloat(item.dueAmount) : 0);
        paid += parseFloat(parseFloat(item.paidAmount) ? parseFloat(item.paidAmount) : 0);
        total += parseFloat(parseFloat(item.totalCost) ? parseFloat(item.totalCost) : 0) && parseFloat(item.totalCost ? item.totalCost : 0) > 0 ? parseFloat(item.totalCost ? item.totalCost : 0) : parseFloat(item.estimateAmount ? item.estimateAmount : 0);
      });

      setTotalDue(due);

      setAmountPaid(paid);

      setTotalCost(total);

      handleClose();
    } catch (error) {
      console.error('Error saving budget item:', error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem({
      id: item.id,
      itemName: item.itemName,
      budgetCategory: item.budgetCategory,
      estimateAmount: item.estimateAmount,
      paidAmount: item.paidAmount,
      totalCost: item.totalCost,
    });
    handleOpen();
  };

  const handleDelete = async (itemToDelete) => {
    const confirmed = window.confirm('Are you sure you want to delete the budget item?');

    if (confirmed) {
      console.log('CURRENT ITEM VALUE: ', currentItem);
      event.budgetItems = event.budgetItems.filter(item => item.id !== itemToDelete.id);
      console.log('AFTER REMOVAL ITEMs ARE: ', event.budgetItems);

      let sumOfBudget = 0;
      event.budgetItems.map(item => {
        sumOfBudget += parseFloat(item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount);
      });

      event.budgetItems.map(item => {
        item.budgetPercent = (((item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount) / sumOfBudget) * 100).toFixed(2);
      })
      const response = await addBudgetItemInDb('events', event);

      if (event.budgetItems.length == 0) {
        setDataPresent(false);
      }
      // To refresh chart data
      setBudgetCategories(response.budgetItems);

      let due = 0;
      let paid = 0;
      let total = 0;
      response.budgetItems.forEach(item => {
        due += parseFloat(parseFloat(item.dueAmount) ? parseFloat(item.dueAmount) : 0);
        paid += parseFloat(parseFloat(item.paidAmount) ? parseFloat(item.paidAmount) : 0);
        total += parseFloat(parseFloat(item.totalCost) ? parseFloat(item.totalCost) : 0) && parseFloat(item.totalCost ? item.totalCost : 0) > 0 ? parseFloat(item.totalCost ? item.totalCost : 0) : parseFloat(item.estimateAmount ? item.estimateAmount : 0);
      });

      setTotalDue(due);

      setAmountPaid(paid);

      setTotalCost(total);
      console.log('State of budgetItems: ', response.budgetItems);
      setItems(response.budgetItems);
    }
  }

  const menuProps = {
    PaperProps: {
      style: {
        width: '100%',
        maxWidth: '400px',
      },
    },
  };
  console.log('Current item: ', currentItem);

  // For Mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <div className="budget-root">

        {dataPresent ? (
          <div className="budget-items">
            {/* Tabbed layout for mobile */}
            {isMobile ? (
              <Tabs
                className='budget-tab-root'
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="budget-tabs"
                sx={{ width: '100%' }}
              >
                <Tab
                  className='budget-tab'
                  label="Budget Statistics"
                  sx={{ flex: 1, textAlign: 'center' }}
                />
                <Tab
                  className='budget-tab'
                  label="Budget List"
                  sx={{ flex: 1, textAlign: 'center' }}
                />
              </Tabs>
            ) : null}
            {/* Check if there are items in the budget */}
            {selectedTab === 0 || !isMobile ? (

              < div >

                <div>
                  {!isMobile ? <h3> Your Budget</h3> : ''}
                  {/* <h3>Your Budget</h3> */}
                  <div className="chart">
                    <div className="total-cost">
                      <h4>Actual Cost:</h4>
                      {!isMobile ?
                        <DonutChart data={totalCostData} labels={chartLabels} position={'right'}></DonutChart> :
                        <DonutChart data={totalCostData} labels={chartLabels} position={'bottom'}></DonutChart>}
                    </div>
                    <div className="max-due-root">
                      <div className="max-budget">
                        <h4> Max Budget</h4>
                        <ProgressChartBar progress={amountPaid} max={maxBudget}></ProgressChartBar>
                      </div>
                      <div className="amount-due">
                        <h4>Amount Due</h4>
                        <ProgressChartBar progress={totalDue} max={totalCost}></ProgressChartBar>
                      </div>
                    </div>
                    <div className="estimated-cost">
                      <h4>Estimated Cost</h4>
                      <DonutChart data={estimateCostData} labels={chartLabels} position={'bottom'}></DonutChart>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedTab == 1 || !isMobile ? (
              <div>
                {/* Budget Items Section */}
                <div className='budget-item-row'>
                  <div className='budget-items-head'>
                    {!isMobile ? <h3>Budget List</h3> : <div></div>}
                    <Button className="btn-add" variant="contained" onClick={handleOpen}>Add Budget Item</Button>
                  </div>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead className="table-header">
                        <TableRow>
                          <TableCell className="table-cell">Item</TableCell>
                          <TableCell className="table-cell">Estimate</TableCell>
                          <TableCell className="table-cell">Paid</TableCell>
                          <TableCell className="table-cell">Due</TableCell>
                          <TableCell className="table-cell">Actual Cost</TableCell>
                          <TableCell className="table-cell">% of Budget</TableCell>
                          <TableCell className="table-cell">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items ? items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>${item.estimateAmount}</TableCell>
                            <TableCell>${item.paidAmount ? item.paidAmount : 0}</TableCell>
                            <TableCell>${item.dueAmount}</TableCell>
                            <TableCell>${item.totalCost ? item.totalCost : 0}</TableCell>
                            <TableCell> {item.budgetPercent && item.budgetPercent !== 0 ? `${item.budgetPercent}%` : '-'}</TableCell>
                            <TableCell className='action-button-cell'>
                              <Button onClick={() => {
                                console.log('open', item);
                                handleEdit(item);
                              }}><i className="fas fa-edit"></i></Button>
                              <Button onClick={() => {
                                handleDelete(item);
                              }}><i className="fas fa-trash"></i></Button>
                            </TableCell>
                          </TableRow>
                        )) : []}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          // "Start budgeting here!" section when there are no items
          <div className='start-budgeting'>
            <h4>Start budgeting here!</h4>
            <Button className="btn-add" variant="contained" onClick={handleOpen}>Add Budget Item</Button>
          </div>)}
      </div >

      {/* Modal for adding/editing items */}
      < Modal open={open} onClose={handleClose} >
        <div className="budget-add-item-root">
          <div className='budget-add-item-content'>
            <div className='budget-add-header'>
              <h4 className="modal-header">{currentItem.id ? 'Edit Item' : 'Add New Item'}</h4>
            </div>
            <div className='budget-add-body'>
              <TextField
                name="itemName"
                label="Item Name"
                onChange={handleChange}
                value={currentItem.itemName}
                type='text'
                className="input-field"
                required
                sx={{
                  input: {
                    padding: '1rem',
                  }
                }}
              />
              {/* Select Category */}
              <Select
                name='budgetCategory'
                className="budget-add-category"
                labelId="budget-category-label"
                id="budgetCategory"
                label="Select Category"
                onChange={handleChange}
                value={currentItem.budgetCategory || ''}
                displayEmpty
                required
                MenuProps={menuProps}
              >
                <MenuItem value="" disabled>Select Category *</MenuItem>
                {Object.values(BudgetCategory).map((event, index) => (
                  <MenuItem key={index} value={event}>
                    {event}
                  </MenuItem>
                ))}
              </Select>

              {/* Estimate Amount, Actual Cost, Paid */}
              <TextField
                name="estimateAmount"
                label="Estimate Amount"
                type="number"
                value={currentItem.estimateAmount}
                onChange={handleChange}
                className="input-field"
                required
                inputProps={{ step: "1.0" }}
              />
              <TextField
                name="totalCost"
                label="Actual Cost"
                type="number"
                value={currentItem.totalCost}
                onChange={handleChange}
                className="input-field"
                inputProps={{ step: "1.0" }}
              />
              <TextField
                name="paidAmount"
                label="Paid"
                type="number"
                value={currentItem.paidAmount}
                onChange={handleChange}
                className="input-field"
                inputProps={{ step: "1.0" }}
              />
            </div>
            <div className='budget-add-footer'>
              <Button
                className='add-update-button' onClick={onSubmit}>
                {currentItem.id ? 'Update Budget Item' : 'Add Budget Item'}
              </Button>
              <Button
                className='cancel-button' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal >
    </>
  )
};
export default BudgetCalculator;