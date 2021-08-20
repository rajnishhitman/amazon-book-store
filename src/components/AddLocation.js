import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';

const AddLocation = (props) => {

    const {register, handleSubmit} = useForm();
    const history = useHistory();


    const onFormSubmit = (location) =>{
        localStorage.setItem("city", location.addCity)
        localStorage.setItem("pincode", location.addPin)
        history.push("/")
        props.refresh()
    }

    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="row border border-secondary mt-5">
                <div className="col-md">
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="mb-2 mt-3">
                            <label for="addCity" className="form-label">Add City</label>
                            <input type="text" className="form-control" id="addCity" name="addCity"  {...register("addCity")} autoComplete="off"/>
                        </div>
                        <div className="mb-2">
                            <label for="addPin" className="form-label">Add Pincode</label>
                            <input type="number" className="form-control" id="addPin" name="addPin" {...register("addPin")} autoComplete="off"/>
                        </div>

                        <button className="btn btn-warning mb-2">Add Location</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddLocation;
