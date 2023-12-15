import { Pagination } from '@mui/lab';

const CustomPagination = ({ page, count, onChange }) => {
    return (
        <Pagination
            page={page}
            count={count}
            onChange={onChange}
            shape="rounded"
            color="primary"
        />
    );
};

export default CustomPagination;
