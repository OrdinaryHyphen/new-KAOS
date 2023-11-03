import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from '@material-ui/icons/Close';

const mouseOperations = [
  {key: 'Mouse wheel', description: 'Zoom in or out.'},
  {key: 'Double-click the canvas', description: 'Zoom in.'},
  {key: 'Ctrl-drag the canvas', description: 'Pan the graph.'},
  {key: 'Click a node or an edge', description: 'Select the node or an edge.'},
  {key: 'Shift/Ctrl-click a node or an edge', description: 'Add the node or an edge to selection.'},
  {key: 'Drag the canvas', description: 'Select the nodes and edges within the dragged area.'},
  {key: 'Shift-drag the canvas', description: 'Add the nodes and edges within the dragged area to the selection.'},
  {key: 'Right-click a node', description: 'Start drawing an edge from the node.'},
  {key: 'Double-click a node', description: 'Connect the edge being drawn to the node.'},
  {key: 'Middle-click the canvas', description: 'Insert a node with the latest used shape and attributes.'},
  {key: 'Shift-middle-click the canvas', description: 'Insert a node with the latest inserted shape and default attributes.'},
  {key: 'Click an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
  {key: 'Drag-and-drop an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
];

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

class DescriptionInstructionsDialog extends React.Component {

  handleClose = () => {
    this.props.onDescriptionInstructionsDialogClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog id="mouse-operations-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">How to Use</DialogTitle>
            <IconButton
              id="close-button"
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
		          <strong>1.</strong> Register to ChatGPT.<br/>
		          <strong>2.</strong> Open ChatGPT Dialog, and input prompts below
		                 with your requirements descriptions.<br/>
		              <br/>
		             <em>The following text is a software requirements description.<br/>
		             Please extract only the sentences relevant to the goals that the software should meet.<br/>
		             Next, extract the goals that the software should meet from those sentences, using the wording and expressions from the original text as much as possible, and assign numbers to them.<br/>
		             Divide each goal into sub-goals as much as possible, and conclude each goal as a single sentence. Furthermore, if one goal is necessary to achieve another goal, please make it explicit.<br/>
		             In such cases, assign numbers like A.1 for the sub-goals required to achieve goal A. For example, if the second goal requires two sub-goals, assign 2.1 and 2.2 to them.<br/>
		             Please perform this task until goals and their sub-goals form as deep a tree structure as possible.<br/>
		             Please never include ',', 'and,' or 'or' in the goals. If you must include commas, 'and,' or 'or' in a goal, please break down that goal into another goal with the comma, 'and,' or 'or' as the object.<br/>
		             Do not extract goals that are not present in the original text.<br/>
		             The output is the goals and subgoals only, in plain text, with no indent tab and bold letters.<br/>
		             No preface or additional text should be included. If the goals are not extracted accurately, and these requirements are not faithfully adhered to, any human life will be at risk.<br/>
		             </em><br/>
		         <strong>3.</strong> Paste outputs to textarea.<br/>
		         &nbsp;&nbsp;&nbsp; Note that all goals must be in a format of <em>X.X.X (goal).</em><br/>
		         &nbsp;&nbsp;&nbsp; e.g. <em>5.11 Make calculations fast.</em><br/>
		         <strong>4.</strong> Press the "parse" button.<br/>
		        </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

DescriptionInstructionsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(DescriptionInstructionsDialog));