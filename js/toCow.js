axios.defaults.headers.post['Content-Type'] = 'application/json';

function buildingToCows() {
    axios.get("https://test.tygron.com/api/session/items/buildings/?f=JSON&token=30306969dVMmAyOljkUJXQtOIRK7oQjV").then(function(response){
        for (building of response.data) {
            axios.post("https://test.tygron.com/api/session/event/editorbuilding/set_function/?token=30306969dVMmAyOljkUJXQtOIRK7oQjV", JSON.stringify([building.id,889]));
        }
    })
}

//https://test.tygron.com/api/session/event/editorbuilding/set_function/?token=48272742RBX3NhwenoNmVloIxNnvNZ5Z
//https://test.tygron.com/api/session/items/buildings/?f=JSON&token=48272742RBX3NhwenoNmVloIxNnvNZ5Z&CRS=EPSG:3857