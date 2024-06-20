import React from 'react';
import Chart from 'react-apexcharts';

type ChartProps = {
  chartData: any[];
  chartOptions: any;
};
type ChartState = {
  chartData: any[];
  chartOptions: any;
};

class ColumnChart extends React.Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  componentDidUpdate(prevProps: ChartProps, prevState: ChartState) {
    if (prevState.chartData !== this.state.chartData || prevState.chartOptions !== this.state.chartOptions) {
      console.log('this.state.chartOptions', this.state.chartOptions, '...', this.state.chartData);
    }
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default ColumnChart;