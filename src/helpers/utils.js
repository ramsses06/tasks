export default function () {
  /**
   * 
   * @param {integer} seconds 
   * representa segundos
   * desde 60 (1 minuto) hasta 7200 (2 horas)
   */
  function formatToMinutesSeconds (seconds) {
    /**
     * -> total de segundos ENTRE segundos que tiene 1 hora redondeando hacia abajo
     * y entonces obtenemos la cantidad de horas
     */
    const hr = Math.floor(seconds / 3600);
    /**
     * -> total de segundos ENTRE segundos que tiene 1 minuto redondeando hacia abajo
     * y entonces obtenemos la cantidad de minutos
     * -> A este le restamos: resultado de "hr" POR minutos que tiene 1 hora
     * y entonces obtenemos el total de minutos restantes
     */
    const min = Math.floor(seconds / 60) - (hr * 60);
    /**
     * -> ((min + (hr * 60)) * 60) es el calculo de total de segundos ya ocurridos
     * restandoselos a total de segundos y obtenemos los segundos que quedan.
     */
    const sec = seconds - ((min + (hr * 60)) * 60);
    let format = '';
    if (hr) format += `${hr} hr `;
    if (min) format += `${min} min `;
    if (sec) format += `${sec} seg`;
    return format;
  }

  /**
   * 
   * @param {integer} seconds 0 - 7200
   * * retorno los filtros validos para una duracion especifica
   */
  function getFilterId (seconds) {
    const [ thirtyMinutes, sixtyMinutes ] = [ 30 * 60, 60 * 60 ];
    const validFilters = [1];
    if (seconds > sixtyMinutes) validFilters.push(4);
    if (seconds >= thirtyMinutes && seconds <= sixtyMinutes) validFilters.push(3);
    if (seconds <= sixtyMinutes) validFilters.push(2);
    return validFilters;
  }

  return {
    formatToMinutesSeconds,
    getFilterId
  }
}