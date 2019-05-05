import React, { Component } from 'react'
import '../../App.css'
import { Menu, Icon } from 'antd';
import { Row, Col, AutoComplete, Badge, Button, Modal, Form, Input, Card, Pagination } from 'antd';
import { Link } from 'react-router-dom'
import axios from 'axios';
var swal = require('sweetalert');

class organizationAll extends Component {

    constructor(props){
        super(props);
        this.state = {
            current: 'all',
            organizationAllData : [],
            organizationOwnData : [],
            viewOrganizationAll : [],
            viewOrganizationOwn : [], 
            organizationAllSize : 0,
            organizationOwnSize : 0, 
            organizationAllPage : 1,
            organizationOwnPage : 1,
            user_id : 4
        }
    }

    componentDidMount(){

        axios.defaults.withCredentials = true;
        axios.get(`http://localhost:8080/hacker/getOtherOrganizations/${this.state.user_id}`)
                    .then((response) => {
                        console.log("Status Code : ", response.status);
                        
                        if (response.status === 200) {
                            console.log("Response received from backend");
                            console.log("\n"+JSON.stringify(response.data.other_organizations));
                            console.log("\n"+JSON.stringify(response.data.own_organizations));
                            this.setState({
                                organizationAllData : response.data.other_organizations,
                                organizationOwnData : response.data.own_organizations
                            }, () => {
                                this.setState({
                                    organizationAllSize:Math.ceil(this.state.organizationAllData.length),
                                    organizationOwnSize:Math.ceil(this.state.organizationOwnData.length),
                                    viewOrganizationAll: this.state.organizationAllData.slice((this.state.organizationAllPage-1)*3,((this.state.organizationAllPage-1)*3)+3),
                                    viewOrganizationOwn: this.state.organizationOwnData.slice((this.state.organizationOwnPage-1)*3,((this.state.organizationOwnPage-1)*3)+3),
                                })
                            })
                        }
                        else{
                            console.log("There was some error fetching list of organization from the backend")
                        }
                    });
        // this.setState({
        //     organizationAllData:[
        //         {
        //             "id":"1",
        //             "description":"This is the description of the Organization 1. This is the description of the Organization 1",
        //             "organization_name": "Organization ABC",

        //         },
        //         {
        //             "id":"2",
        //             "description":"This is the description of the Organization 2. This is the description of the Organization 2",
        //             "organization_name": "Organization DEF",
                    
        //         },
        //         {
        //             "id":"3",
        //             "description":"This is the description of the Organization 3. This is the description of the Organization 3",
        //             "organization_name": "Organization GHI",
                    
        //         },
        //         {
        //             "id":"4",
        //             "description":"This is the description of the Organization 4. This is the description of the Organization 4",
        //             "organization_name": "Organization JKL",
                    
        //         },
        //         {
        //             "id":"5",
        //             "description":"This is the description of the Organization 5. This is the description of the Organization 5",
        //             "organization_name": "Organization MNO",
                    
        //         }
        //     ],
        //     organizationOwnData : [
        //         {
        //             "id":"6",
        //             "description":"This is the description of the Organization 6. This is the description of the Organization 6",
        //             "organization_name": "Organization PQR",     
        //         },
        //         {
        //             "id":"7",
        //             "description":"This is the description of the Organization 7. This is the description of the Organization 7",
        //             "organization_name": "Organization STU",     
        //         },
        //         {
        //             "id":"8",
        //             "description":"This is the description of the Organization 8. This is the description of the Organization 8",
        //             "organization_name": "Organization VWX",     
        //         },
        //     ]
        // }, () => {
        //     this.setState({
        //         organizationAllSize:Math.ceil(this.state.organizationAllData.length),
        //         organizationOwnSize:Math.ceil(this.state.organizationOwnData.length),
        //         vieworganizationAll: this.state.organizationAllData.slice((this.state.organizationAllPage-1)*3,((this.state.organizationAllPage-1)*3)+3),
        //         viewOrganizationOwn: this.state.organizationOwnData.slice((this.state.organizationOwnPage-1)*3,((this.state.organizationOwnPage-1)*3)+3),
        //     })
        // })

    }

    onChangeOrganizationOwn = (page) =>{
        console.log("onChangeOrganizationOwn function called!")
        console.log("Page : "+page)
        this.setState({
            organizationOwnPage:page,
            viewOrganizationOwn:this.state.organizationOwnData.slice((page-1)*3,((page-1)*3)+3)
        })
    }

    onChangeOrganizationAll = (page) =>{
        console.log("onChangeOrganizationAll function called!")
        console.log("Page : "+page)
        this.setState({
            organizationAllPage:page,
            viewOrganizationAll:this.state.organizationAllData.slice((page-1)*3,((page-1)*3)+3)
        })
    }

    render(){

        var organizationAllCards = this.state.viewOrganizationAll && this.state.viewOrganizationAll.map(card => {
            return(
                <div class="px-3 py-5">
                <Col span={6}>
                    <a href="#">
                        <Card
                            cover={<img alt="example" src="https://www.humanresourcesmba.net/wp-content/uploads/2014/10/morgan-mccall-e1412343960471.jpg?x58695" />}
                            title={card && card.name}
                            bordered={true}
                            style={{ width: 350 }}>
                            <center>{card && card.description}</center>
                            <hr></hr>
                            <center class="py-2">
                                <Button type="primary">View</Button>
                            </center>
                        </Card>
                    </a>
                </Col>
            </div>
            )
        })

        var organizationOwnCards = this.state.viewOrganizationOwn && this.state.viewOrganizationOwn.map(card => {
            return(
                <div class="px-3 py-5">
                <Col span={6}>
                    <a href="#">
                        <Card
                            cover={<img alt="example" src="https://www.humanresourcesmba.net/wp-content/uploads/2014/10/morgan-mccall-e1412343960471.jpg?x58695" />}
                            title={card && card.name}
                            bordered={true}
                            style={{ width: 350 }}>
                            <center>{card && card.description}</center>
                            <hr></hr>
                            <center class="py-2">
                                <Button type="primary">View</Button>
                            </center>
                        </Card>
                    </a>
                </Col>
            </div>
            )
        })


        return(
            <div>
                <div class="px-4 py-4">
                    <h2>Organizations</h2>
                </div>
                <div class="px-4 py-3" id="main">
                    <hr></hr>
                    <a href="#own" class="px-4">
                    <Badge count={this.state.organizationOwnSize}>
                        <h4>My Organizations</h4>
                    </Badge>
                    </a>
                    <a href="#all" class="px-4">
                    <Badge count={this.state.organizationAllSize}>
                        <h4>Other Organizations</h4>
                    </Badge>
                    </a>
                    <hr></hr>
                </div>
                <div class="px-4 py-3" id="own">
                    <h5 class="px-4">My Organizations</h5>
                    <Row type="flex">
                        {organizationOwnCards}
                    </Row>
                    <center><Pagination current={this.state.organizationOwnPage} onChange={this.onChangeOrganizationOwn} defaultPageSize={3} total={this.state.organizationOwnSize} /></center>
                </div>
                <div class="px-4 py-3" id="all">
                    <h5 class="px-4">Other Organizations</h5>
                    <Row type="flex">
                        {organizationAllCards}
                    </Row>
                    <center><Pagination current={this.state.organizationAllPage} onChange={this.onChangeOrganizationAll} defaultPageSize={3} total={this.state.organizationAllSize} /></center>
                </div>
            </div>
        )
    }
}

export default organizationAll;