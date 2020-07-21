import { UrlService } from '../../services/sidebar.service';
import { Subscription } from '../../../../node_modules/rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {Chart} from 'chart.js';
import { TableroComponent } from './tablero.component';
import { StreamUtils } from 'xlsx/types';
import { element } from 'protractor';

export class tipoTablero {
    private dataDashboardSubscription:Subscription;
    chart:Chart;
    public aleatorio:string;
    
        
    constructor(private _sidebar: UrlService,private _dashboard:DashboardService){ }
    mapearData(parametro:number,tipoApi:string,idhtml:string,titulo:string,typeChart:string,leyendaD1:string,leyendaD2:string){
        this.dataDashboardSubscription=this._dashboard.obtenerData(parametro,tipoApi).subscribe((data)=>{
            var putLabel=data['DataArray'].map(data=>data.Labels);
            var putDataSet1=data['DataArray'].map(data=>data.DataSet1);
            var putDataSet2=data['DataArray'].map(data=>data.DataSet2);
            
            this.configuracion(putLabel,putDataSet1,putDataSet2,titulo,idhtml,typeChart,leyendaD1,leyendaD2);            
        });

    } 

    
    
    configuracion(etLabel:any[],etDataset1:any[],etDataSet2:any[],titulo:string,idhtml:string,typeChart:string,leyendaD1:string,leyendaD2:string){
        let labelArray=[];
        let datosArray=etDataSet2;
        var etiquetas=[];
        var datos=[];
        var et={};
        
        
        var max = datosArray.reduce(function (prev, current) {
            return (prev > current) ? prev : current
         });
        
         function color(){
            function colorAleatorio(inferior,superior){
                let numPosibilidades = superior - inferior
                let aleat = Math.random() * numPosibilidades
                aleat = Math.floor(aleat)
                return parseInt(inferior) + aleat
            }
            var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
            var aleatorio = "#";
            for (let i=0;i<6;i++){
                var posarray = colorAleatorio(0,hexadecimal.length)
                aleatorio += hexadecimal[posarray]
            }
            return aleatorio
        }
        if(typeChart=='line'){
            etLabel.forEach(element=>{
                if(!labelArray.includes(element)){
                    labelArray.push(element);                
                }          
            });      
            
            labelArray.forEach(function(label,i){
                datos=[];
                etLabel.forEach(function(data,j){
                    if(label==data){
                        datos.push(etDataSet2[j]);
                    }
                    else{
                        datos.push(0);
                    }                
                });            
                et={
                    label: labelArray[i],
                    data:datos,
                    borderColor:color(),
                    fill:false
                };
                etiquetas.push(et);                        
            });        
            
            var configline={
                type: typeChart,
                data: {
                  labels:etDataset1,
                  datasets:etiquetas,
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: titulo
                    },				
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: leyendaD1
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: leyendaD2
                            },
                            ticks: {
                                min: 0,
                                max: max,
                                stepSize: 1
                              },
                        }]
                    }           
                }           
            }
            this.chart=new Chart(idhtml,configline);
        }
        if(typeChart=='horizontalBar'){
            var configbar={
                type:typeChart,
                data:{
                    labels: etLabel,
                    datasets:[
                        {label:leyendaD1, data:etDataset1,
                        backgroundColor:color()},
                        {label:leyendaD2, data:etDataSet2,
                        backgroundColor: color()}
                        ]
                    },
                    options:{
                        title: {
                            display: true,                            
                            text:titulo
                        },
                        //animation: {duration: 5000},
                        legend:{display: true},
                        scales:{
                            xAxes: [{stacked: false,}],
                            yAxes: [{stacked: false,}]
                        }
                    }
            };
            this.chart=new Chart(idhtml,configbar);
        }       
    }   
    ngOnDestroy(){
        this.dataDashboardSubscription.unsubscribe();    
    }
}