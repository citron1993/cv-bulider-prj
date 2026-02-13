import { Link } from "react-router-dom"

const Navigation = () => {
    return (
        <nav style={{ display: "flex", width:"400vm", padding: "10px",justifyContent:"space-between" }}>
           
            <Link to="/edit">Edit CV</Link>
            <Link to="/preview">Preview CV</Link>
        </nav>
    )
}

export default Navigation