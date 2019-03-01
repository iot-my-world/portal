import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary, Grid,
} from '@material-ui/core'
import Query from 'brain/search/Query'
import {RecordHandler as ReadingRecordHandler} from 'brain/tracker/reading'
import {RecordHandler as ClientRecordHandler} from 'brain/party/client'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MultiSelect from 'components/multiSelect'
import {FullPageLoader} from 'components/loader/index'
import {
  RecordHandler as CompanyRecordHandler,
} from 'brain/party/company'
import {ListTextCriterion} from 'brain/search/criterion/list'
import {OrCriterion} from 'brain/search/criterion'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
  },
  expanderRoot: {},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  // select component styles
  selectRoot: {padding: 10},
  availableRoot: {},
  availableWindow: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  selectedRoot: {},
  selectedWindow: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  chip: {},
  chipWrapper: {
    padding: 2,
  },
  searchField: {
    width: '100%',
  },
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

const filterPanels = {
  company: 0,
  client: 1,
}

class Live extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.handleClientFilterChange = this.handleClientFilterChange.bind(this)
    this.handleCompanyFilterChange = this.handleCompanyFilterChange.bind(
        this)
    this.load = this.load.bind(this)
    this.state = {
      expanded: null,
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 3.5,
        bearing: 0,
        pitch: 0,
      },
      popupInfo: null,
      loading: true,
    }
    this.companies = []
    this.clients = []

    this.selectedClientIds = []
    this.selecedCompanyIds = []

    this.collectCritera = []
    this.collectQuery = new Query()

    this.collectTimeout = () => {
    }
  }

  async load() {
    this.setState({loading: true})
    try {
      this.companies = (await CompanyRecordHandler.Collect()).records
    } catch (e) {
      console.error('error collecting companies', e)
      return
    }
    try {
      this.clients = (await ClientRecordHandler.Collect()).records
    } catch (e) {
      console.error('error collecting clients', e)
      return
    }
    this.setState({loading: false})
  }

  componentDidMount() {
    this.load().then(() => this.collect())
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  async collect() {
    let collectReadingsResponse
    try {
      collectReadingsResponse =
          await ReadingRecordHandler.Collect(this.collectCritera)
    } catch (e) {
      console.error('error collecting readings', e)
    }
  }

  handleClientFilterChange(selected, available) {
    this.selectedClientIds = selected.map(client => client.id)
    // otherwise there is some criteria
    const OrCrit = new OrCriterion()
    OrCrit.criteria = [
      new ListTextCriterion({
        field: 'assignedId.id',
        list: [
          ...this.selectedClientIds,
          ...this.selecedCompanyIds,
        ],
      }),
      new ListTextCriterion({
        field: 'ownerId.id',
        list: [
          ...this.selectedClientIds,
          ...this.selecedCompanyIds,
        ],
      }),
    ]
    this.collectCritera = [OrCrit]
    this.collectTimeout = setTimeout(this.collect, 300)
  }

  handleCompanyFilterChange(selected, available) {
    this.selecedCompanyIds = selected.map(client => client.id)
    const OrCrit = new OrCriterion()
    OrCrit.criteria = [
      new ListTextCriterion({
        field: 'assignedId.id',
        list: [
          ...this.selectedClientIds,
          ...this.selecedCompanyIds,
        ],
      }),
      new ListTextCriterion({
        field: 'ownerId.id',
        list: [
          ...this.selectedClientIds,
          ...this.selecedCompanyIds,
        ],
      }),
    ]
    this.collectCritera = [OrCrit]
    this.collectTimeout = setTimeout(this.collect, 300)
  }

  renderFiltersMenu() {
    const {classes} = this.props
    const {expanded} = this.state

    return <div className={classes.root}>
      <ExpansionPanel expanded={expanded === filterPanels.client}
                      onChange={this.handleChange(filterPanels.client)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Company Filter</Typography>
          <Typography className={classes.secondaryHeading}>
            Select Companies You'd Like Displayed
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid
              container
              direction='column'
              spacing={8}
              alignItems='center'
          >
            <Grid item>
              <MultiSelect
                  displayAccessor='name'
                  uniqueIdAccessor='id'
                  selected={this.companies}
                  available={[]}
                  onChange={this.handleCompanyFilterChange}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === filterPanels.company}
                      onChange={this.handleChange(filterPanels.company)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Client Filter</Typography>
          <Typography className={classes.secondaryHeading}>
            Select Clients You'd Like Displayed
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid
              container
              direction='column'
              spacing={8}
              alignItems='center'
          >
            <Grid item>
              <MultiSelect
                  displayAccessor='name'
                  uniqueIdAccessor='id'
                  selected={this.clients}
                  available={[]}
                  onChange={this.handleClientFilterChange}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel3'}
                      onChange={this.handleChange('panel3')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Map Settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Configure How The Map Looks
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas
            eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  }

  render() {
    const {
      classes,
    } = this.props
    const {loading} = this.state
    return <div className={classes.root}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {this.renderFiltersMenu()}
      </div>
      <div>
      </div>
      <FullPageLoader open={loading}/>
    </div>
  }
}

Live = withStyles(styles)(Live)

Live.propTypes = {}
Live.defaultProps = {}

export default Live