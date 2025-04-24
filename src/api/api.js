const BASE_URL = 'http://localhost:8080/api/'

async function request(path, { method = 'GET', body=false, token , params={}} = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let url = `${BASE_URL}${path}`;
    if (method === 'GET' && params && Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
      }
      
    const res = await fetch(`${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'REQUEST_ERROR');
    }
    return res.json();
}

export function login(credentials) {
    return request('auth/login', {
        method: 'POST',
        body: credentials,
    });
}

export function getOffices(token){
    return request('office',{
        method: 'GET',
        body:false,
        token:token
    });
}

export function saveEmployee(payload,token){
    request('employee',{
        method: 'POST',
        body:  payload,
        token: token,
    })
}

export function getEmployees(token,params){
    return request('employee',{
        method: 'GET',
        body:false,
        token:token,
        params:params
    })
}

export function getAssignedOfficesByEmployee(employeeId,token){
    return request(`employee/get-assigned-offices/${employeeId}`,{
        method:'GET',
        body:false,
        token:token
    })
}

export function deleteEmployee(employeeId,token){
    request(`employee/${employeeId}`,{
        method: 'DELETE',
        body:  false,
        token: token,
    })
}