import { jsPDF } from 'jspdf';

const GeneratorPDF =(componentRef, a4='a2')=>{

    const pdf = new jsPDF('p', 'pt', a4,'in');
    pdf.html(componentRef.current, {
        callback: function(pdf){
            var date = new Date().toLocaleDateString();
            var hour = new Date().toLocaleTimeString().replaceAll(':','_');
            
            pdf.save(`${date}_${hour}.pdf`);
        }
    });

}

export default GeneratorPDF;