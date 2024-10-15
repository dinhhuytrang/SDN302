import SideBar from "./component/SideBar"
import Header from "./Header"
import { Col, Container, Row } from "react-bootstrap"

const HomeAdmin = () => {
    return (
        <div style={{paddingBottom:"20px"}}>
            {/* <Header /> */}
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default HomeAdmin