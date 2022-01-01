import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import React from 'react';
import { QueryBucketItem } from '../shared/types';

interface Props {
  object: QueryBucketItem;
}
export const ObjectItem: React.FC<Props> = React.memo(({ object }) => {
  const nameArr = object.name.split('/');
  const name = nameArr.pop();

  return (
    <Card variant="outlined" sx={{ marginBottom: 1, marginTop: 1 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {nameArr.join('/')}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
});
ObjectItem.displayName = 'ObjectItem';
