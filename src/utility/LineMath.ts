import { Vector2 } from "./VectorMath";

function onSegment(p: Vector2, q: Vector2, r: Vector2) : boolean
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;

    return false;
}

// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orientation(p: Vector2, q : Vector2, r: Vector2) : number
{
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    let val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // colinear 

    return (val > 0) ? 1 : 2; // clock or counterclock wise 
}

// The main function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
export function DoIntersect(p1: Vector2, q1: Vector2, p2: Vector2, q2: Vector2): boolean
    {
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case 
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases 
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases 
}


export function GetLineIntersection(A: Vector2, B : Vector2, C: Vector2, D: Vector2, source? : Vector2) : Vector2
{
    if (source == undefined) source = new Vector2();


    // Line AB represented as a1x + b1y = c1  
    let a1 = B.y - A.y;
    let b1 = A.x - B.x;
    let c1 = a1 * (A.x) + b1 * (A.y);

    // Line CD represented as a2x + b2y = c2  
    let a2 = D.y - C.y;
    let b2 = C.x - D.x;
    let c2 = a2 * (C.x) + b2 * (C.y);

    let determinant = a1 * b2 - a2 * b1;

    if (determinant == 0)
    {
        // The lines are parallel. This is simplified  
        // by returning a pair of FLT_MAX  
        return undefined;
    }
    else
    {
        let x = (b2 * c1 - b1 * c2) / determinant;
        let y = (a1 * c2 - a2 * c1) / determinant;
        return source.set(x, y);
    }
}
