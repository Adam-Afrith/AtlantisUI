import React from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
	[x: string]: any;
	chartData: any[];
  chartOptions: any;
};
type ChartState = {
	chartData: any[];
	chartOptions: any;
};

class PieChart extends React.Component<ChartProps, ChartState> {
	constructor(props: ChartProps) {
		super(props);

		this.state = {
			chartData: [],
			chartOptions: {}
		};
		console.log('this.state',this.state.chartData,'..',this.state.chartOptions);
	}
   
	componentDidMount() {
		this.setState({
			chartData: this.props.chartData,
			chartOptions: this.props.chartOptions
		});
	}
	componentDidUpdate(prevProps: ChartProps) {
		if (prevProps.chartData !== this.props.chartData || prevProps.chartOptions !== this.props.chartOptions) {
		  this.setState({
			chartData: this.props.chartData,
			chartOptions: this.props.chartOptions
		  });
		}
	  }
	render() {
		return (
			<ReactApexChart
				options={this.state.chartOptions}
				series={this.state.chartData}
				type='pie'
				width='100%'
				height='55%'
			/>
		);
	}
}

export default PieChart;