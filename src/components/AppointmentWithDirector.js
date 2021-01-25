import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { jsPDF } from "jspdf";
import Header from 'components/Header';

class AppointmentWithDirector extends Component {

    state = {
        nombreAlumno: '',
        dniAlumno: '',

        document: {},
        modal: false,
        docName: '',
    }

    handleForPDF = (event) => {
        event.preventDefault();
        const { nombreAlumno, dniAlumno } = this.state;

        const title = 'CITA CON EL DIRECTOR';

        if(nombreAlumno !== '' && dniAlumno !== ''){

            const primerParrafo = `D./Dª ${nombreAlumno}, con DNI nº ${dniAlumno}, que cursa el Grado en Ingeniería Informática, solicita una cita con el Director.`;

            this.setState({
                disabledButton: false,
            })
            var doc = new jsPDF('p','in', 'letter', true),
                size = 12,
                font = ['Times', 'Roman'],
                font, size, firstLine, secondLine, thirdLine,
                margin = 0.5, // inches on a 8.5 x 11 inch sheet.
                verticalOffset = margin;

            // Margins:
            doc.setDrawColor(0, 255, 0)

            firstLine = doc.setFont(font[0], font[1])
                .setFontSize(18)
                .splitTextToSize(title, 18);

            thirdLine = doc.setFont(font[0], font[1])
                .setFontSize(size)
                .splitTextToSize(primerParrafo, 7.5);


            doc.text(3.2, verticalOffset + 18 / 72, firstLine)
            verticalOffset += (firstLine.length + 0.7) * 30 / 72

            doc.text(0.5, verticalOffset + 18 / 72, thirdLine)
            verticalOffset += (firstLine.length + 0.8) * 30 / 72


            doc.save("citaDirector.pdf");
            this.setState({
                document: doc
            });

        }else{
            alert('Debes completar todos los campos para generar tu documento.')
        }

    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }


    render () {

        const { nombreAlumno, dniAlumno } = this.state;


        return (
            <>
                <Header/>
                <section id="content" >
                    <div className="pt-5 mt-5">
                        <h2 className="subheaderdos">SOLICITAR CITA CON EL DIRECTOR</h2>
                    </div>
                    <form onSubmit={this.handleForPDF}>

                        <Row className={''}>
                            <Col xs={'4'} className={'text-right'}>
                                <label htmlFor='name'>Nombre del Alumno</label>
                            </Col>
                            <Col xs={'8'} className={'text-left'} >
                                <input className={'mt-2 font'} id='nombreAlumno' required='true' type='text' name='nombreAlumno' value={nombreAlumno} onChange={this.handleChange} />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={'4'} className={'text-right'}>
                                <label className={'mt-2'} htmlFor='text'>DNI del Alumno</label>
                            </Col>
                            <Col xs={'8'}>
                                <input className={'mt-2 font'} id='dniAlumno' required='true' type='text' name='dniAlumno' value={dniAlumno} onChange={this.handleChange} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className={'text-center'}>
                                <input className={'mt-4'} type='submit' value='Generar PDF' />
                            </Col>
                        </Row>

                    </form>

                </section>
            </>
        );
    }
}
export default AppointmentWithDirector;