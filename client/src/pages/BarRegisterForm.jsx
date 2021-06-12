import React, { useContext } from 'react';
import { BarContext } from '../barContext';
import { UserContext } from '../userContext';
import axios from 'axios';

const BarRegisterForm = () => {
  const {
    barName,
    setBarName,
    contactInformation,
    address,
    setAddress,
    phone,
    setPhone,
    email,
    setEmail,
    details,
    hoursOfOperation,
    setHoursOfOperation,
    description,
    setDescription,
    showForm,
    toggleForm,
    currentBar,
    setCurrentBar,
    wasUpdated,
    handleBarInfoChange,
  } = useContext(BarContext);
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBar = {
      name: barName,
      googleId: userInfo.googleId,
      contactInformation: {
        address,
        phone,
        email,
      },
      details: {
        hoursOfOperation,
        description,
      },
    };

    axios.post('/routes/businesses', newBar)
      .then(({ data: bizInfo }) => {
        const barId = bizInfo._id;
        setUserInfo({ ...userInfo, businessId: barId });
        toggleForm();
      })
      .catch((err) => console.error(err));
  };

  const handleChange = () => {
    if (userInfo.businessId && wasUpdated === false) {
      handleBarInfoChange();
    }
  };

  const handleUpdateBar = () => {
    const updatedBar = {
      name: barName,
      contactInformation: {
        address,
        phone,
        email,
      },
      details: {
        hoursOfOperation,
        description,
      },
    };

    console.log(updatedBar);

    if (wasUpdated) {
      axios.patch(`/routes/businesses/${currentBar._id}`, updatedBar)
        .then(({ data: bizInfo }) => {
          setCurrentBar(bizInfo);
          toggleForm();
        })
        .catch((err) => console.error(err));
    } else {
      alert('Please make changes to your bar information before trying to submit the form.');
    }
  };

  const handleDelete = () => {
    console.log(`businessId: ${userInfo.businessId} googleId: ${userInfo.googleId}`);
    axios.delete(`/routes/businesses/${userInfo.businessId}/${userInfo.googleId}`)
      .then(res => {
        const { data: bool } = res
        if (bool) {
          setCurrentBar({});
        }
      });
  };

  return (
    showForm ? (
      <div>
        <div>
          <div className='create-button'>
            <button className="btn btn-info" type="button" onClick={toggleForm} > X </button>
          </div>
        </div>
        <div className='form-group'>
          <form className='input-form ' onSubmit={handleSubmit}>
            {userInfo.businessId ?
              (
                <h1 className="page-heading" style={{ paddingBottom: '0px' }}>Edit Your Business</h1>
              ) : (
                <h1 className="page-heading" style={{ paddingBottom: '0px' }}>Create Your Business</h1>
              )}
            <div>
              <h4 className='create-form-heading'>Name Your Business *</h4>
              <input
                className="form-control"
                type="text"
                placeholder="Fat Tuesday"
                name="barName"
                value={barName}
                onChange={(e) => {
                  handleChange();
                  setBarName(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <h3 className="page-heading" style={{ paddingBottom: '0px' }}>Contact Information</h3>
              <h4 className='create-form-heading'>Address *</h4>
              <textarea
                className='form-control'
                rows='3'
                cols='50'
                placeholder={`633 Bourbon St\nNew Orleans, LA\n70130`}
                name="address"
                value={address}
                onChange={(e) => {
                  handleChange();
                  setAddress(e.target.value);
                }}
                required
              />
              <div class="form-row">
                <div class="col-6">
                  <h4 className='create-form-heading'>Phone *</h4>
                  <input
                    className="form-control"
                    type='tel'
                    placeholder="504-524-5185"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      handleChange();
                      setPhone(e.target.value);
                    }}
                    required
                  />
                  <p className='text-muted'>Required Format: 555-555-5555</p>
                </div>
                <div className="col-6">
                  <h4 className='create-form-heading'>Email</h4>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="help@fattuesday.com"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      handleChange();
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
              </div>
              <h3 className="page-heading" style={{ paddingBottom: '0px' }}>Other Details</h3>
              <h4 className='create-form-heading'>Hours of Operation *</h4>
              <textarea
                className='form-control'
                rows='5'
                cols='50'
                placeholder={`Monday - Thursday: 11am - midnight\n\nFriday-Saturrday: 10am-2am\n\nSunday: 10am-midnight`}
                name='hoursOfOperation'
                value={hoursOfOperation}
                onChange={(e) => {
                  handleChange();
                  setHoursOfOperation(e.target.value);
                }}
                required
              />
              <h4 className='create-form-heading'>Description *</h4>
              <textarea
                className='form-control'
                rows='4'
                cols='50'
                placeholder={`The Best Party in Town. Any Town.\n\nEverywhere else it’s just a Tuesday. Want in?`}
                name='description'
                value={description}
                onChange={(e) => {
                  handleChange();
                  setDescription(e.target.value);
                }}
                required
              />
              <h5 className='create-form-heading'>Required *</h5>
            </div>
            {userInfo.businessId ?
              (
                <div>
                  <div className='create-button'>
                    <button className="btn btn-primary" type="button" onClick={handleUpdateBar} > Submit Changes </button>
                  </div>
                  <div className='create-button'>
                    <button className="btn btn-danger" type="button" onClick={handleDelete} > Delete Your Business </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className='create-button'>
                    <button className="btn btn-primary" type="submit" onClick={handleSubmit} > Register </button>
                  </div>
                </div>
              )}
          </form>
        </div>
      </div>
    )
      : userInfo.businessId ?
        (
          <div>
            <div className='create-button'>
              <button className="btn btn-info" type="button" onClick={toggleForm} > Edit Your Bar </button>
            </div>
            <div className="container">
              <h2 className="page-heading" style={{ padding: '55px 0 0 0' }}>
                {barName}
              </h2>
              <div className=" align-self-center custom-info">
                <h4 style={{ paddingBottom: '10px', textTransform: 'capitalize' }}>
                  {description}
                </h4>
                <hr />
                <h5 style={{ paddingBottom: '10px' }}>Location and Hours</h5>
                <p>{hoursOfOperation}</p>
                <p className="contact-info-paragraph">{address}</p>
                <p className="contact-info-paragraph">{phone}</p>
                <p className="contact-info-paragraph">{email}</p>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className='create-button'>
              <button className="btn btn-primary" type="button" onClick={toggleForm} > Register Your Bar </button>
            </div>
          </div>
        )
  )
}

export default BarRegisterForm;
