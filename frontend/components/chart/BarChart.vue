<script>
  import { Bar, mixins } from 'vue-chartjs'

  const { reactiveProp } = mixins
  export default {
    extends: Bar,
    mixins: [ reactiveProp ],
    props: {
      chartData:{
        type:Object,
        default:null
      },
      options:{
        type:Object,
        default: () => {
          return {
            scales: {
              yAxes: [{
                stacked:true,
                ticks: {
                  beginAtZero: true,
                  fontSize:0,
                  
                },
                gridLines: {
                  display: true,
                  lineWidth:0,
                },
                afterFit: function(scaleInstance) {
                  scaleInstance.width = 80; 
                }
              }],
              xAxes: [ {
                stacked:true,
                ticks:{
                    beginAtZero:true,
                },
                gridLines:{
                    display: false,
                    lineWidth:0,
                    
                },
              }],
            },
            legend: {
              display: true,
              position:'right'
            },
            responsive: true,
            maintainAspectRatio: false
          } 
        }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    },
  }
</script>
