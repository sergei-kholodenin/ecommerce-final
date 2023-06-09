import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {Form, Button, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

function UserEditScreen() {
    const {id:userId} = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const {loading, error, user} = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const {loading:loadingUpdate, error:errorUpdate, success:successUpdate} = userUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({type:USER_UPDATE_RESET});
            navigate('/admin/userlist');
        } else {
            if (!user.name || user._id !== +userId) {
                dispatch(getUserDetails(userId))            
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }        
    }, [user, userId, successUpdate, navigate]);

    const submitHandler = (e)  => {
        e.preventDefault();
        dispatch(updateUser({_id:user._id, name, email, isAdmin}));   
    }
    return (
        <div>
            <Link to={`/admin/userlist`}>
                Go Back
            </Link>
            <FormContainer>
                <h1 style={{margin: '1rem'}}>Edit User</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Alert variant='danger'>{errorUpdate}</Alert>}
                {loading ? <Loader/> : error ? <Alert variant='danger'>{error}</Alert> : (
                    <Form onSubmit={submitHandler}>
                    
                        <Form.Group controlId='name' style={{padding: '1rem'}}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
        
                        <Form.Group controlId='email' style={{padding: '1rem'}}>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
        
                        <Form.Group controlId='isAdmin' style={{padding: '1rem'}}>
                            <Form.Check 
                                type="checkbox"
                                label="Is Admin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>
        
                        <Button type='submit' variant='primary' style={{margin: '1rem'}}>Update</Button>
        
                    </Form>
                    
                )}
            </FormContainer>
        </div>
        
    );
}

export default UserEditScreen;