import Contacts from './Contacts';
import Search from './Search';

function Sidebar() {
    return (
        <div className="shadow-2xl w-96 bg-slate-700  flex flex-col">
            <Search />
            <Contacts />
        </div>
    );
}

export default Sidebar;
